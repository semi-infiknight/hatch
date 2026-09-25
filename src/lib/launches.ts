import type { SkuId, StockId } from "@/lib/catalog"

export const LAUNCHES_KEY = "hatch:launches:v1"

export interface LaunchRecord {
  stockId: StockId
  skuId: SkuId
  name: string
  symbol: string
  mint: string
  pool: string
  tx: string
  launchedAt: number
}

export function loadLaunches(): LaunchRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(LAUNCHES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LaunchRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((row) => row.pool && row.skuId && row.stockId)
  } catch {
    return []
  }
}

export function saveLaunch(record: LaunchRecord) {
  const next = [record, ...loadLaunches().filter((row) => row.pool !== record.pool)]
  window.localStorage.setItem(LAUNCHES_KEY, JSON.stringify(next))
}

export function tickerSymbol(ticker: string) {
  return ticker.replace(/[^A-Z0-9]/g, "").slice(0, 10)
}
