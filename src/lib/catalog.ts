export type StockId = "TTWO" | "NKE" | "HAS" | "SONY" | "DIS"
export type SkuId = "VICE" | "NKE_DROP" | "HAS_SET" | "SONY_HW" | "DIS_DROP"

export interface Stock {
  id: StockId
  name: string
  ticker: string
  solanaName: string
  venues: string[]
  price: number
  changePct: number
  line: string
}

export interface OraclePrint {
  venue: string
  soldPrice: number
  daysAgo: number
}

export interface Sku {
  id: SkuId
  stockId: StockId
  name: string
  ticker: string
  retailUsd: number
  twapUsd: number
  targetUnits: number
  oracleVenues: string[]
  prints: OraclePrint[]
  summary: string
  objectLabel: string
  accent: string
}

const EQUITY_VENUES = ["Backpack", "Jupiter", "Phantom"]

export const STOCKS: Stock[] = [
  {
    id: "TTWO",
    name: "Take-Two Interactive",
    ticker: "TTWO",
    solanaName: "TTWO",
    venues: [...EQUITY_VENUES],
    price: 178.4,
    changePct: 0.012,
    line: "TTWO is the spine, and the sealed Vice City box sits under it.",
  },
  {
    id: "NKE",
    name: "Nike",
    ticker: "NKE",
    solanaName: "NKE",
    venues: [...EQUITY_VENUES],
    price: 78.15,
    changePct: 0.004,
    line: "NKE is the mark, and the sealed size-10 pair sits under it.",
  },
  {
    id: "HAS",
    name: "Hasbro",
    ticker: "HAS",
    solanaName: "HAS",
    venues: [...EQUITY_VENUES],
    price: 62.3,
    changePct: 0.008,
    line: "HAS is the house, and the sealed booster box sits under it.",
  },
  {
    id: "SONY",
    name: "Sony",
    ticker: "SONY",
    solanaName: "SONY",
    venues: [...EQUITY_VENUES],
    price: 21.4,
    changePct: 0.011,
    line: "SONY is the maker, and the sealed anniversary console sits under it.",
  },
  {
    id: "DIS",
    name: "Disney",
    ticker: "DIS",
    solanaName: "DIS",
    venues: [...EQUITY_VENUES],
    price: 96.2,
    changePct: 0.006,
    line: "DIS is the estate, and the sealed park statue sits under it.",
  },
]

export const SKUS: Sku[] = [
  {
    id: "VICE",
    stockId: "TTWO",
    name: "Goodtime State — Vice City Collection",
    ticker: "VICE",
    retailUsd: 399.99,
    twapUsd: 545,
    targetUnits: 2000,
    oracleVenues: ["eBay sold", "StockX", "Rockstar store"],
    prints: [
      { venue: "eBay sold", soldPrice: 532, daysAgo: 1 },
      { venue: "StockX", soldPrice: 558, daysAgo: 3 },
      { venue: "Rockstar store", soldPrice: 545, daysAgo: 5 },
      { venue: "eBay sold", soldPrice: 549, daysAgo: 8 },
      { venue: "StockX", soldPrice: 528, daysAgo: 11 },
      { venue: "eBay sold", soldPrice: 561, daysAgo: 14 },
    ],
    summary: "VICE is the edition, still sealed and hatched from TTWO.",
    objectLabel: "Sealed collector box",
    accent: "copper",
  },
  {
    id: "NKE_DROP",
    stockId: "NKE",
    name: "Nike SB × Supreme Dunk Low — sealed, size 10",
    ticker: "NKE:DROP",
    retailUsd: 180,
    twapUsd: 410,
    targetUnits: 400,
    oracleVenues: ["StockX", "eBay sold", "SNKRS restock"],
    prints: [
      { venue: "StockX", soldPrice: 395, daysAgo: 1 },
      { venue: "eBay sold", soldPrice: 428, daysAgo: 2 },
      { venue: "SNKRS restock", soldPrice: 410, daysAgo: 4 },
      { venue: "StockX", soldPrice: 402, daysAgo: 7 },
      { venue: "eBay sold", soldPrice: 418, daysAgo: 10 },
      { venue: "StockX", soldPrice: 407, daysAgo: 14 },
    ],
    summary: "The Dunk is the drop, still sealed in size 10 and hatched from NKE.",
    objectLabel: "Sealed pair, size 10",
    accent: "ink",
  },
  {
    id: "HAS_SET",
    stockId: "HAS",
    name: "Magic: The Gathering Foundations Collector Booster Box — sealed",
    ticker: "HAS:SET",
    retailUsd: 279.99,
    twapUsd: 340,
    targetUnits: 800,
    oracleVenues: ["TCGPlayer sold", "eBay sold"],
    prints: [
      { venue: "TCGPlayer sold", soldPrice: 328, daysAgo: 1 },
      { venue: "eBay sold", soldPrice: 352, daysAgo: 3 },
      { venue: "TCGPlayer sold", soldPrice: 340, daysAgo: 6 },
      { venue: "eBay sold", soldPrice: 335, daysAgo: 9 },
      { venue: "TCGPlayer sold", soldPrice: 348, daysAgo: 12 },
      { venue: "eBay sold", soldPrice: 337, daysAgo: 14 },
    ],
    summary: "Foundations is the set, still sealed and hatched from HAS.",
    objectLabel: "Sealed booster box",
    accent: "gold",
  },
  {
    id: "SONY_HW",
    stockId: "SONY",
    name: "PlayStation 30th Anniversary Console — sealed",
    ticker: "SONY:HW",
    retailUsd: 499.99,
    twapUsd: 890,
    targetUnits: 120,
    oracleVenues: ["eBay sold", "StockX"],
    prints: [
      { venue: "eBay sold", soldPrice: 860, daysAgo: 2 },
      { venue: "StockX", soldPrice: 920, daysAgo: 4 },
      { venue: "eBay sold", soldPrice: 890, daysAgo: 6 },
      { venue: "StockX", soldPrice: 875, daysAgo: 8 },
      { venue: "eBay sold", soldPrice: 905, daysAgo: 11 },
      { venue: "StockX", soldPrice: 890, daysAgo: 14 },
    ],
    summary: "The 30th console is the hardware, still sealed and hatched from SONY.",
    objectLabel: "Sealed console",
    accent: "cobalt",
  },
  {
    id: "DIS_DROP",
    stockId: "DIS",
    name: "Disney100 Platinum Legacy Statue — sealed park exclusive",
    ticker: "DIS:DROP",
    retailUsd: 249.99,
    twapUsd: 310,
    targetUnits: 500,
    oracleVenues: ["eBay sold", "shopDisney"],
    prints: [
      { venue: "eBay sold", soldPrice: 298, daysAgo: 1 },
      { venue: "shopDisney", soldPrice: 322, daysAgo: 4 },
      { venue: "eBay sold", soldPrice: 310, daysAgo: 7 },
      { venue: "shopDisney", soldPrice: 305, daysAgo: 9 },
      { venue: "eBay sold", soldPrice: 318, daysAgo: 12 },
      { venue: "shopDisney", soldPrice: 307, daysAgo: 14 },
    ],
    summary: "The Platinum statue is the drop, still sealed and hatched from DIS.",
    objectLabel: "Sealed statue",
    accent: "platinum",
  },
]

const stockById = Object.fromEntries(STOCKS.map((stock) => [stock.id, stock])) as Record<
  StockId,
  Stock
>

const skuById = Object.fromEntries(SKUS.map((sku) => [sku.id, sku])) as Record<SkuId, Sku>

export function getStock(id: StockId): Stock {
  return stockById[id]
}

export function getSku(id: SkuId): Sku {
  return skuById[id]
}

export function skusFor(stockId: StockId): Sku[] {
  return SKUS.filter((sku) => sku.stockId === stockId)
}

export function skuForTicker(ticker: string): Sku | undefined {
  return SKUS.find((sku) => sku.ticker === ticker)
}
