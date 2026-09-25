"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  STOCKS,
  getSku,
  getStock,
  skusFor,
  type Sku,
  type SkuId,
  type Stock,
  type StockId,
} from "@/lib/catalog"
import {
  deposit as depositReserve,
  launch as launchReserve,
  navPerToken,
  premiumPct,
  redeem as redeemReserve,
  seededLive,
  sellPremium as sellPremiumReserve,
  setFees as setFeesReserve,
  setRaiseTarget as setRaiseTargetReserve,
  setTicker as setTickerReserve,
  tick,
  tokensForOneUnit as tokensForOneUnitReserve,
  vaultValue as vaultValueReserve,
  type ReserveState,
} from "@/lib/reserve-sim"

const STORAGE_KEY = "hatch:v2"
const SEEDED_LAUNCH_AGE_MS = 36 * 60 * 60 * 1000
const RENDER_NOW = 1_758_844_800_000

const STOCK_IDS: readonly StockId[] = ["TTWO", "NKE", "HAS", "SONY", "DIS"]
const SKU_IDS: readonly SkuId[] = ["VICE", "NKE_DROP", "HAS_SET", "SONY_HW", "DIS_DROP"]

type Store = Partial<Record<SkuId, ReserveState>>

type ReserveContextValue = {
  stock: Stock
  sku: Sku
  stocks: Stock[]
  skuOptions: Sku[]
  state: ReserveState
  stockPrice: number
  nav: number
  premium: number
  vaultValue: number
  tokensForOneUnit: number
  selectStock: (id: StockId) => void
  selectSku: (id: SkuId) => void
  setRaiseTarget: (n: number) => void
  setFees: (sku: number, equity: number, buffer: number) => void
  setTicker: (t: string) => void
  launch: () => void
  redeem: (tokens: number) => void
  deposit: (units: number) => void
  sellPremium: () => void
}

const ReserveContext = createContext<ReserveContextValue | null>(null)

function isStockId(value: string | null | undefined): value is StockId {
  return !!value && (STOCK_IDS as readonly string[]).includes(value)
}

function isSkuId(value: string | null | undefined): value is SkuId {
  return !!value && (SKU_IDS as readonly string[]).includes(value)
}

function isReserveState(value: unknown): value is ReserveState {
  if (!value || typeof value !== "object") return false
  const state = value as ReserveState
  return (
    isSkuId(state.skuId) &&
    (state.phase === "draft" || state.phase === "filling" || state.phase === "live") &&
    typeof state.raiseTarget === "number" &&
    typeof state.ticker === "string"
  )
}

function stockPriceAt(stockId: StockId, now: number): number {
  const base = getStock(stockId).price
  return base * (1 + Math.sin(now / 20_000) * 0.0015)
}

function readStore(): Store {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return {}
    const store: Store = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (!isSkuId(key) || !isReserveState(value) || value.skuId !== key) continue
      store[key] = value
    }
    return store
  } catch {
    return {}
  }
}

function writeSku(state: ReserveState) {
  if (typeof window === "undefined") return
  try {
    const store = readStore()
    store[state.skuId] = state
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Ignore private-mode and quota failures. The desk still ticks in memory.
  }
}

function isLaunchedDraft(state: ReserveState): boolean {
  if (state.phase === "draft" || state.phase === "filling") return true
  if (state.launchedAt == null) return false
  const age = state.lastTick - state.launchedAt
  return age >= 0 && age < SEEDED_LAUNCH_AGE_MS - 60 * 60 * 1000
}

function stateForSku(sku: Sku, store: Store, now: number): ReserveState {
  const stored = store[sku.id]
  if (stored && stored.skuId === sku.id && isLaunchedDraft(stored)) return stored
  return seededLive(sku, now)
}

function firstSku(stockId: StockId): SkuId {
  return skusFor(stockId)[0]?.id ?? "VICE"
}

function resolveSelection(
  search: string | null,
  initialStock?: StockId,
  initialSku?: SkuId,
): { stockId: StockId; skuId: SkuId } {
  const params =
    search == null ? null : new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
  const queryStock = params?.get("stock")
  const querySku = params?.get("sku")
  const qStock = isStockId(queryStock) ? queryStock : undefined
  const qSku = isSkuId(querySku) ? querySku : undefined
  const pStock = isStockId(initialStock) ? initialStock : undefined
  const pSku = isSkuId(initialSku) ? initialSku : undefined

  if (qSku && qStock) {
    if (getSku(qSku).stockId === qStock) return { stockId: qStock, skuId: qSku }
    return { stockId: qStock, skuId: firstSku(qStock) }
  }
  if (qSku) return { stockId: getSku(qSku).stockId, skuId: qSku }
  if (qStock) {
    if (pSku && getSku(pSku).stockId === qStock) return { stockId: qStock, skuId: pSku }
    return { stockId: qStock, skuId: firstSku(qStock) }
  }

  if (pSku && pStock) {
    if (getSku(pSku).stockId === pStock) return { stockId: pStock, skuId: pSku }
    return { stockId: pStock, skuId: firstSku(pStock) }
  }
  if (pSku) return { stockId: getSku(pSku).stockId, skuId: pSku }
  if (pStock) return { stockId: pStock, skuId: firstSku(pStock) }
  return { stockId: "TTWO", skuId: "VICE" }
}

function keepTerms(prev: ReserveState, next: ReserveState): ReserveState {
  return {
    ...next,
    feeSku: prev.feeSku,
    feeEquity: prev.feeEquity,
    feeBuffer: prev.feeBuffer,
    raiseTarget: prev.raiseTarget,
  }
}

export function ReserveProvider({
  children,
  initialStock,
  initialSku,
}: {
  children: ReactNode
  initialStock?: StockId
  initialSku?: SkuId
}) {
  const boot = resolveSelection(null, initialStock, initialSku)
  const [stockId, setStockId] = useState<StockId>(boot.stockId)
  const [skuId, setSkuId] = useState<SkuId>(boot.skuId)
  const [state, setState] = useState<ReserveState>(() => seededLive(getSku(boot.skuId), RENDER_NOW))
  const [now, setNow] = useState(RENDER_NOW)

  useEffect(() => {
    const clock = Date.now()
    const selection = resolveSelection(window.location.search, initialStock, initialSku)
    const sku = getSku(selection.skuId)
    const next = stateForSku(sku, readStore(), clock)
    setStockId(selection.stockId)
    setSkuId(selection.skuId)
    setNow(clock)
    setState(next)

    const id = window.setInterval(() => {
      const tickNow = Date.now()
      setNow(tickNow)
      setState((prev) => {
        const price = stockPriceAt(getSku(prev.skuId).stockId, tickNow)
        const nextState = keepTerms(prev, tick(prev, tickNow, price))
        writeSku(nextState)
        return nextState
      })
    }, 500)

    return () => window.clearInterval(id)
  }, [initialStock, initialSku])

  const apply = useCallback((updater: (prev: ReserveState) => ReserveState) => {
    setState((prev) => {
      const next = updater(prev)
      writeSku(next)
      return next
    })
  }, [])

  const selectStock = useCallback((id: StockId) => {
    if (!isStockId(id)) return
    const sku = getSku(firstSku(id))
    const clock = Date.now()
    setNow(clock)
    setStockId(id)
    setSkuId(sku.id)
    setState((prev) => {
      writeSku(prev)
      const next = stateForSku(sku, readStore(), clock)
      writeSku(next)
      return next
    })
  }, [])

  const selectSku = useCallback((id: SkuId) => {
    if (!isSkuId(id)) return
    const sku = getSku(id)
    const clock = Date.now()
    setNow(clock)
    setStockId(sku.stockId)
    setSkuId(sku.id)
    setState((prev) => {
      writeSku(prev)
      const next = stateForSku(sku, readStore(), clock)
      writeSku(next)
      return next
    })
  }, [])

  const setRaiseTarget = useCallback(
    (n: number) => {
      apply((prev) => setRaiseTargetReserve(prev, n))
    },
    [apply],
  )

  const setFees = useCallback(
    (sku: number, equity: number, buffer: number) => {
      apply((prev) => setFeesReserve(prev, sku, equity, buffer))
    },
    [apply],
  )

  const setTicker = useCallback(
    (t: string) => {
      apply((prev) => setTickerReserve(prev, t))
    },
    [apply],
  )

  const launch = useCallback(() => {
    const clock = Date.now()
    setNow(clock)
    apply((prev) => launchReserve(prev, clock))
  }, [apply])

  const redeem = useCallback(
    (tokens: number) => {
      const clock = Date.now()
      setNow(clock)
      apply((prev) => {
        const price = stockPriceAt(getSku(prev.skuId).stockId, clock)
        const per = tokensForOneUnitReserve(prev, price)
        // The desk quotes tokens on render. The live price can move before submit,
        // which made a 1-unit redeem fall just short of `per` and no-op.
        // apply((prev) => redeemReserve(prev, tokens, clock, stockPriceAt(getSku(prev.skuId).stockId, clock)))
        if (!(tokens > 0) || !(per > 0)) return prev
        const units = Math.round(tokens / per)
        if (units < 1) return prev
        return redeemReserve(prev, units * per, clock, price)
      })
    },
    [apply],
  )

  const deposit = useCallback(
    (units: number) => {
      const clock = Date.now()
      setNow(clock)
      apply((prev) => depositReserve(prev, units, clock, stockPriceAt(getSku(prev.skuId).stockId, clock)))
    },
    [apply],
  )

  const sellPremium = useCallback(() => {
    const clock = Date.now()
    setNow(clock)
    apply((prev) => sellPremiumReserve(prev, clock, stockPriceAt(getSku(prev.skuId).stockId, clock)))
  }, [apply])

  const stock = getStock(stockId)
  const sku = getSku(skuId)
  const stockPrice = stockPriceAt(stock.id, now)

  const value = useMemo<ReserveContextValue>(
    () => ({
      stock,
      sku,
      stocks: STOCKS,
      skuOptions: skusFor(stock.id),
      state,
      stockPrice,
      nav: navPerToken(state, stockPrice),
      premium: premiumPct(state, stockPrice),
      vaultValue: vaultValueReserve(state, stockPrice),
      tokensForOneUnit: tokensForOneUnitReserve(state, stockPrice),
      selectStock,
      selectSku,
      setRaiseTarget,
      setFees,
      setTicker,
      launch,
      redeem,
      deposit,
      sellPremium,
    }),
    [
      stock,
      sku,
      state,
      stockPrice,
      selectStock,
      selectSku,
      setRaiseTarget,
      setFees,
      setTicker,
      launch,
      redeem,
      deposit,
      sellPremium,
    ],
  )

  return <ReserveContext.Provider value={value}>{children}</ReserveContext.Provider>
}

export function useReserve() {
  const value = useContext(ReserveContext)
  if (!value) throw new Error("useReserve must be used within ReserveProvider")
  return value
}
