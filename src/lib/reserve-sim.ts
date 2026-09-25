import { getSku, getStock, type Sku, type SkuId } from "@/lib/catalog"
import { VICE_GRADUATION_USDC } from "@/lib/dbc"

export interface CrankEvent {
  id: string
  at: number
  kind:
    | "buy_primary"
    | "buy_secondary"
    | "attest"
    | "fee_sku"
    | "fee_equity"
    | "fee_buffer"
    | "premium_sell"
    | "redeem"
    | "deposit"
    | "curve"
  label: string
  unitsDelta: number
  usdcDelta: number
}

export interface RedeemOrder {
  id: string
  at: number
  tokens: number
  units: number
  status: "attesting" | "shipped"
}

export interface ReserveState {
  skuId: SkuId
  ticker: string
  raiseTarget: number
  raiseFilled: number
  feeSku: number
  feeEquity: number
  feeBuffer: number
  reserveSupplyPct: number
  phase: "draft" | "filling" | "live"
  units: number
  usdcBuffer: number
  parentShares: number
  supply: number
  reserveTokens: number
  marketPrice: number
  twap: number
  events: CrankEvent[]
  redeemQueue: RedeemOrder[]
  launchedAt: number | null
  lastTick: number
}

const RAISE_TARGET: Record<SkuId, number> = {
  VICE: VICE_GRADUATION_USDC,
  GTA_VINYL: 140_000,
  RDR_BOX: 160_000,
  NKE_DROP: 120_000,
  NKE_TRAVIS: 180_000,
  NKE_OFFWHITE: 150_000,
  HAS_SET: 140_000,
  HAS_POKEMON: 180_000,
  HAS_TRANSFORMERS: 110_000,
  SONY_HW: 100_000,
  SONY_PORTAL: 90_000,
  SONY_PSP: 80_000,
  DIS_DROP: 90_000,
  DIS_LEGO: 160_000,
  DIS_PIN: 80_000,
}

const SEED_UNITS: Partial<Record<SkuId, number>> = {
  VICE: 186,
  NKE_DROP: 42,
  HAS_SET: 60,
  SONY_HW: 18,
  DIS_DROP: 40,
}

const SEED_SHARES: Partial<Record<SkuId, number>> = {
  VICE: 420,
  NKE_DROP: 180,
  HAS_SET: 260,
  SONY_HW: 300,
  DIS_DROP: 140,
}

const SEED_BUYS: Partial<Record<SkuId, [number, number, number]>> = {
  VICE: [12, 8, 6],
  NKE_DROP: [4, 3, 2],
  HAS_SET: [8, 6, 4],
  SONY_HW: [2, 1, 1],
  DIS_DROP: [6, 4, 3],
}

const LIVE_SUPPLY = 1_000_000
const LIVE_RESERVE = 100_000
const FILL_MS = 8_000
const STEP_MS = 4_000
const MIN_TICK_MS = 400
const MAX_EVENTS = 40
const MAX_STEPS = 48
const MIN_FEE = 0.05
const MAX_FEE = 0.9

type BuyKind = "buy_primary" | "buy_secondary"

function finite(n: number): number {
  return Number.isFinite(n) ? n : 0
}

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo
  return Math.min(hi, Math.max(lo, n))
}

function roundTo(n: number, digits: number): number {
  if (!Number.isFinite(n)) return 0
  const p = 10 ** digits
  return Math.round(n * p) / p
}

function usd(n: number): string {
  const rounded = Math.round(finite(n))
  const sign = rounded < 0 ? "-" : ""
  const body = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${sign}$${body}`
}

function formatCount(n: number): string {
  if (!Number.isFinite(n)) return "0"
  if (Math.abs(n - Math.round(n)) < 1e-6) return String(Math.round(n))
  return String(roundTo(n, 2))
}

function makeId(kind: string, at: number, n: number): string {
  return `${kind}-${Math.floor(finite(at))}-${n}`
}

function noun(skuId: SkuId, count: number): string {
  const plural = Math.abs(count) !== 1
  const sku = getSku(skuId)
  const one = sku.objectLabel.toLowerCase()
  if (!plural) return one
  if (one.endsWith("x")) return `${one}es`
  if (one.endsWith("s")) return one
  return `${one}s`
}

function buyLabel(skuId: SkuId, units: number, kind: BuyKind): string {
  const qty = `${formatCount(units)} ${noun(skuId, units)}`
  const sku = getSku(skuId)
  const store = sku.oracleVenues[0] ?? "the store"
  const secondary = sku.oracleVenues[1] ?? "eBay"
  return kind === "buy_primary"
    ? `Bought ${qty} from ${store}`
    : `Bought ${qty} on ${secondary}`
}

function equityTicker(skuId: SkuId): string {
  return getStock(getSku(skuId).stockId).ticker
}

function withEvents(events: CrankEvent[], extra: CrankEvent[]): CrankEvent[] {
  if (extra.length === 0) return events
  const merged = events.concat(extra)
  return merged.length > MAX_EVENTS ? merged.slice(merged.length - MAX_EVENTS) : merged
}

function quoteMarket(nav: number, now: number): number {
  if (!(nav > 0) || !Number.isFinite(now)) return 0
  const px = nav * (1.02 + Math.sin(now / 8000) * 0.12)
  return Number.isFinite(px) ? px : 0
}

function normalizeFees(sku: number, equity: number, buffer: number): [number, number, number] {
  let values = [sku, equity, buffer].map((part) => clamp(part, MIN_FEE, MAX_FEE))
  for (let iter = 0; iter < 8; iter++) {
    const sum = values[0] + values[1] + values[2]
    if (Math.abs(sum - 1) < 1e-10) break
    const reducing = sum > 1
    const adjustable = values.map((value) => (reducing ? value > MIN_FEE + 1e-12 : value < MAX_FEE - 1e-12))
    const room = adjustable.filter(Boolean).length
    if (room === 0) break
    const delta = (1 - sum) / room
    values = values.map((value, index) =>
      adjustable[index] ? clamp(value + delta, MIN_FEE, MAX_FEE) : value,
    )
  }
  const sum = values[0] + values[1] + values[2]
  if (sum > 0 && Math.abs(sum - 1) > 1e-8) {
    values = values.map((value) => value / sum)
  }
  return [values[0], values[1], values[2]]
}

function undeployedCash(s: ReserveState, stockPrice: number): number {
  const deployed = s.units * s.twap + s.usdcBuffer + s.parentShares * stockPrice
  return s.raiseFilled - deployed
}

function buyKindFor(events: CrankEvent[]): BuyKind {
  const buys = events.filter((event) => event.kind === "buy_primary" || event.kind === "buy_secondary").length
  return buys % 2 === 0 ? "buy_primary" : "buy_secondary"
}

function applyCrankStep(s: ReserveState, at: number, stockPrice: number): ReserveState {
  const batch: CrankEvent[] = []
  let seq = s.events.length
  const push = (partial: Omit<CrankEvent, "id">) => {
    batch.push({ ...partial, id: makeId(partial.kind, partial.at, seq) })
    seq += 1
  }

  let units = s.units
  let usdcBuffer = s.usdcBuffer
  let parentShares = s.parentShares
  const idle = undeployedCash(s, stockPrice)
  let chunk = 0

  if (idle >= 1 && s.twap > 0 && s.raiseTarget > 0) {
    chunk = Math.min(idle, Math.max(s.raiseTarget * 0.08, s.twap))
    const skuCash = chunk * s.feeSku
    const equityCash = chunk * s.feeEquity
    const unitsBuy = Math.floor(skuCash / s.twap)
    const skuSpent = unitsBuy * s.twap
    let bufferAdd = chunk * s.feeBuffer + (skuCash - skuSpent)

    if (unitsBuy >= 1) {
      units += unitsBuy
      const kind = buyKindFor(s.events.concat(batch))
      push({
        at,
        kind,
        label: buyLabel(s.skuId, unitsBuy, kind),
        unitsDelta: unitsBuy,
        usdcDelta: -roundTo(skuSpent, 2),
      })
      push({
        at,
        kind: "attest",
        label: "Attested into vault US-1",
        unitsDelta: 0,
        usdcDelta: 0,
      })
    }

    if (stockPrice > 0) {
      parentShares += equityCash / stockPrice
    } else {
      bufferAdd += equityCash
    }
    usdcBuffer += bufferAdd
  }

  const baseVault = units * s.twap + usdcBuffer + parentShares * stockPrice
  const volume = chunk > 0 ? chunk : Math.max(0, baseVault * 0.002)
  const fee = volume * 0.0025
  if (fee >= 1 && s.twap > 0) {
    const skuCash = fee * s.feeSku
    const equityCash = fee * s.feeEquity
    const bufferCash = fee * s.feeBuffer
    const unitAdd = skuCash / s.twap
    const shareAdd = stockPrice > 0 ? equityCash / stockPrice : 0
    units += unitAdd
    parentShares += shareAdd
    usdcBuffer += bufferCash + (stockPrice > 0 ? 0 : equityCash)
    if (unitAdd > 0) {
      push({
        at,
        kind: "fee_sku",
        label:
          unitAdd >= 1
            ? `Fees bought ${formatCount(unitAdd)} ${noun(s.skuId, unitAdd)}`
            : `Fees swept into ${noun(s.skuId, 2)}`,
        unitsDelta: roundTo(unitAdd, 4),
        usdcDelta: 0,
      })
    }
    if (shareAdd > 0) {
      push({
        at,
        kind: "fee_equity",
        label: `Fees bought ${equityTicker(s.skuId)}`,
        unitsDelta: 0,
        usdcDelta: 0,
      })
    }
    if (bufferCash > 0) {
      push({
        at,
        kind: "fee_buffer",
        label: "Fees parked in the USDC buffer",
        unitsDelta: 0,
        usdcDelta: roundTo(bufferCash, 2),
      })
    }
  }

  return {
    ...s,
    units: roundTo(units, 4),
    usdcBuffer: roundTo(usdcBuffer, 2),
    parentShares: roundTo(parentShares, 4),
    events: withEvents(s.events, batch),
  }
}

function runLiveSteps(state: ReserveState, from: number, steps: number, stockPrice: number): ReserveState {
  let next = state
  const count = Math.min(Math.max(0, Math.floor(steps)), MAX_STEPS)
  for (let i = 0; i < count; i++) {
    next = applyCrankStep(next, from + (i + 1) * STEP_MS, stockPrice)
  }
  return next
}

function seedEvents(sku: Sku, now: number): CrankEvent[] {
  const hour = 60 * 60 * 1000
  const [primaryQty, secondaryQty, laterQty] = SEED_BUYS[sku.id] ?? [4, 3, 2]
  const feeUnits = sku.id === "VICE" || sku.id === "HAS_SET" ? 2 : 1
  const ticker = equityTicker(sku.id)
  const drafts: Omit<CrankEvent, "id">[] = [
    {
      at: now - 20 * hour,
      kind: "buy_primary",
      label: buyLabel(sku.id, primaryQty, "buy_primary"),
      unitsDelta: primaryQty,
      usdcDelta: -roundTo(primaryQty * sku.twapUsd, 2),
    },
    {
      at: now - 17 * hour,
      kind: "attest",
      label: "Attested into vault US-1",
      unitsDelta: 0,
      usdcDelta: 0,
    },
    {
      at: now - 14 * hour,
      kind: "buy_secondary",
      label: buyLabel(sku.id, secondaryQty, "buy_secondary"),
      unitsDelta: secondaryQty,
      usdcDelta: -roundTo(secondaryQty * sku.twapUsd, 2),
    },
    {
      at: now - 11 * hour,
      kind: "attest",
      label: "Attested into vault US-1",
      unitsDelta: 0,
      usdcDelta: 0,
    },
    {
      at: now - 8 * hour,
      kind: "fee_sku",
      label: `Fees bought ${feeUnits} ${noun(sku.id, feeUnits)}`,
      unitsDelta: feeUnits,
      usdcDelta: 0,
    },
    {
      at: now - 5 * hour,
      kind: "fee_equity",
      label: `Fees bought ${ticker}`,
      unitsDelta: 0,
      usdcDelta: 0,
    },
    {
      at: now - 3 * hour,
      kind: "fee_buffer",
      label: "Fees parked in the USDC buffer",
      unitsDelta: 0,
      usdcDelta: roundTo(sku.twapUsd * 0.2, 2),
    },
    {
      at: now - hour,
      kind: "buy_primary",
      label: buyLabel(sku.id, laterQty, "buy_primary"),
      unitsDelta: laterQty,
      usdcDelta: -roundTo(laterQty * sku.twapUsd, 2),
    },
  ]
  return drafts.map((event, index) => ({ ...event, id: makeId(event.kind, event.at, index) }))
}

export function vaultValue(s: ReserveState, stockPrice: number): number {
  const value = s.units * s.twap + s.usdcBuffer + s.parentShares * finite(stockPrice)
  return Number.isFinite(value) ? value : 0
}

export function navPerToken(s: ReserveState, stockPrice: number): number {
  if (!(s.supply > 0)) return 0
  const nav = vaultValue(s, stockPrice) / s.supply
  return Number.isFinite(nav) ? nav : 0
}

export function premiumPct(s: ReserveState, stockPrice: number): number {
  const nav = navPerToken(s, stockPrice)
  if (!(nav > 0)) return 0
  const pct = (s.marketPrice - nav) / nav
  return Number.isFinite(pct) ? pct : 0
}

export function tokensForOneUnit(s: ReserveState, stockPrice: number): number {
  const nav = navPerToken(s, stockPrice)
  if (!(nav > 0)) return 0
  const tokens = s.twap / nav
  return Number.isFinite(tokens) ? tokens : 0
}

export function createDraft(sku: Sku): ReserveState {
  return {
    skuId: sku.id,
    ticker: sku.ticker,
    raiseTarget: RAISE_TARGET[sku.id] ?? 90_000,
    raiseFilled: 0,
    feeSku: 0.5,
    feeEquity: 0.3,
    feeBuffer: 0.2,
    reserveSupplyPct: 0.1,
    phase: "draft",
    units: 0,
    usdcBuffer: 0,
    parentShares: 0,
    supply: 0,
    reserveTokens: 0,
    marketPrice: 0,
    twap: sku.twapUsd,
    events: [],
    redeemQueue: [],
    launchedAt: null,
    lastTick: 0,
  }
}

export function seededLive(sku: Sku, now: number): ReserveState {
  const draft = createDraft(sku)
  const stockPrice = getStock(sku.stockId).price
  const state: ReserveState = {
    ...draft,
    phase: "live",
    raiseFilled: draft.raiseTarget,
    supply: LIVE_SUPPLY,
    reserveTokens: LIVE_RESERVE,
    units: SEED_UNITS[sku.id] ?? 20,
    usdcBuffer: Math.round(draft.raiseTarget * 0.08),
    parentShares: SEED_SHARES[sku.id] ?? 80,
    twap: sku.twapUsd,
    events: seedEvents(sku, now),
    launchedAt: now - 1000 * 60 * 60 * 36,
    lastTick: now,
  }
  return {
    ...state,
    marketPrice: quoteMarket(navPerToken(state, stockPrice), now),
  }
}

export function launch(s: ReserveState, now: number): ReserveState {
  return {
    ...s,
    phase: "filling",
    launchedAt: now,
    raiseFilled: 0,
    supply: 0,
    lastTick: now,
  }
}

export function tick(s: ReserveState, now: number, stockPrice: number): ReserveState {
  if (s.phase === "draft") return s
  if (!Number.isFinite(now)) return s
  if (now - s.lastTick < MIN_TICK_MS) return s

  const px = finite(stockPrice)
  if (s.phase === "filling") {
    const start = s.launchedAt ?? now
    const elapsed = Math.max(0, now - start)
    const progress = Math.min(1, elapsed / FILL_MS)
    const raiseFilled = roundTo(s.raiseTarget * progress, 2)
    const delta = roundTo(raiseFilled - s.raiseFilled, 2)
    const curve: CrankEvent[] =
      delta > 0
        ? [
            {
              id: makeId("curve", now, s.events.length),
              at: now,
              kind: "curve",
              label: `Curve filled ${usd(raiseFilled)} of ${usd(s.raiseTarget)}`,
              unitsDelta: 0,
              usdcDelta: delta,
            },
          ]
        : []
    let next: ReserveState = {
      ...s,
      raiseFilled,
      lastTick: now,
      events: withEvents(s.events, curve),
    }
    if (progress < 1 && next.raiseFilled + 0.5 < next.raiseTarget) return next

    next = {
      ...next,
      phase: "live",
      raiseFilled: next.raiseTarget,
      supply: LIVE_SUPPLY,
      reserveTokens: LIVE_RESERVE,
    }
    const liveStart = start + FILL_MS
    const extra = Math.floor(Math.max(0, now - liveStart) / STEP_MS)
    next = runLiveSteps(next, liveStart - STEP_MS, 1 + extra, px)
    return {
      ...next,
      marketPrice: quoteMarket(navPerToken(next, px), now),
      lastTick: now,
    }
  }

  const steps = Math.floor((now - s.lastTick) / STEP_MS)
  const next = steps > 0 ? runLiveSteps(s, s.lastTick, steps, px) : s
  return {
    ...next,
    marketPrice: quoteMarket(navPerToken(next, px), now),
    lastTick: now,
  }
}

export function setFees(s: ReserveState, sku: number, equity: number, buffer: number): ReserveState {
  const [feeSku, feeEquity, feeBuffer] = normalizeFees(sku, equity, buffer)
  return { ...s, feeSku, feeEquity, feeBuffer }
}

export function setRaiseTarget(s: ReserveState, n: number): ReserveState {
  return { ...s, raiseTarget: clamp(n, 50_000, 5_000_000) }
}

export function setTicker(s: ReserveState, ticker: string): ReserveState {
  return { ...s, ticker }
}

export function redeem(s: ReserveState, tokens: number, now: number, stockPrice: number): ReserveState {
  if (s.phase !== "live" || !(s.units >= 1) || !Number.isFinite(tokens) || tokens <= 0) return s
  const per = tokensForOneUnit(s, stockPrice)
  if (!(per > 0) || tokens < per) return s
  const requested = Math.floor(tokens / per)
  const available = Math.floor(s.units)
  const n = Math.min(requested, available)
  if (n < 1) return s
  const burn = Math.min(s.supply, n * per)
  if (!(burn > 0)) return s

  const event: CrankEvent = {
    id: makeId("redeem", now, s.events.length),
    at: now,
    kind: "redeem",
    label: `Redeemed ${n} ${noun(s.skuId, n)}`,
    unitsDelta: -n,
    usdcDelta: 0,
  }
  const order: RedeemOrder = {
    id: makeId("redeem-order", now, s.redeemQueue.length),
    at: now,
    tokens: roundTo(burn, 6),
    units: n,
    status: "attesting",
  }
  const queue = s.redeemQueue.map((item) => ({ ...item }))
  queue.push(order)
  if (queue.length > 3) {
    const oldest = queue.findIndex((item) => item.status === "attesting" && item.id !== order.id)
    if (oldest >= 0) queue[oldest] = { ...queue[oldest], status: "shipped" }
  }

  return {
    ...s,
    units: roundTo(s.units - n, 4),
    supply: roundTo(s.supply - burn, 6),
    events: withEvents(s.events, [event]),
    redeemQueue: queue,
  }
}

export function deposit(s: ReserveState, units: number, now: number, stockPrice: number): ReserveState {
  if (s.phase !== "live" || !Number.isFinite(units) || units < 1) return s
  const nav = navPerToken(s, stockPrice)
  if (!(nav > 0) || !(s.twap > 0)) return s
  const whole = Math.floor(units)
  if (whole < 1) return s
  const mint = Math.round((whole * s.twap) / nav)
  if (!(mint > 0) || !Number.isFinite(mint)) return s

  const event: CrankEvent = {
    id: makeId("deposit", now, s.events.length),
    at: now,
    kind: "deposit",
    label: `Deposited ${whole} ${noun(s.skuId, whole)} into vault US-1`,
    unitsDelta: whole,
    usdcDelta: 0,
  }
  return {
    ...s,
    units: roundTo(s.units + whole, 4),
    supply: roundTo(s.supply + mint, 6),
    events: withEvents(s.events, [event]),
  }
}

export function sellPremium(s: ReserveState, now: number, stockPrice: number): ReserveState {
  if (s.phase !== "live" || !(s.reserveTokens > 1000) || !(s.twap > 0)) return s
  const nav = navPerToken(s, stockPrice)
  if (!(nav > 0) || !(s.marketPrice > nav)) return s
  const sold = s.reserveTokens * 0.02
  const proceeds = sold * s.marketPrice
  if (!Number.isFinite(proceeds) || proceeds <= 0) return s
  const unitsBuy = Math.floor(proceeds / s.twap)
  const remainder = proceeds - unitsBuy * s.twap
  const event: CrankEvent = {
    id: makeId("premium_sell", now, s.events.length),
    at: now,
    kind: "premium_sell",
    label:
      unitsBuy >= 1
        ? `Sold reserve into the premium and bought ${unitsBuy} ${noun(s.skuId, unitsBuy)}`
        : "Sold reserve into the premium",
    unitsDelta: unitsBuy,
    usdcDelta: roundTo(remainder, 2),
  }
  return {
    ...s,
    reserveTokens: roundTo(s.reserveTokens - sold, 4),
    units: roundTo(s.units + unitsBuy, 4),
    usdcBuffer: roundTo(s.usdcBuffer + remainder, 2),
    events: withEvents(s.events, [event]),
  }
}
