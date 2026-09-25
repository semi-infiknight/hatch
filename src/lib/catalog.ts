export type StockId = "TTWO" | "NKE" | "HAS" | "SONY" | "DIS"
export type SkuId =
  | "VICE"
  | "GTA_VINYL"
  | "RDR_BOX"
  | "NKE_DROP"
  | "NKE_TRAVIS"
  | "NKE_OFFWHITE"
  | "HAS_SET"
  | "HAS_POKEMON"
  | "HAS_TRANSFORMERS"
  | "SONY_HW"
  | "SONY_PORTAL"
  | "SONY_PSP"
  | "DIS_DROP"
  | "DIS_LEGO"
  | "DIS_PIN"

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
    line: "Take-Two stock on Solana. The sealed Vice City box is the product behind it.",
  },
  {
    id: "NKE",
    name: "Nike",
    ticker: "NKE",
    solanaName: "NKE",
    venues: [...EQUITY_VENUES],
    price: 78.15,
    changePct: 0.004,
    line: "Nike stock on Solana. The sealed size-10 pair is the product behind it.",
  },
  {
    id: "HAS",
    name: "Hasbro",
    ticker: "HAS",
    solanaName: "HAS",
    venues: [...EQUITY_VENUES],
    price: 62.3,
    changePct: 0.008,
    line: "Hasbro stock on Solana. The sealed booster box is the product behind it.",
  },
  {
    id: "SONY",
    name: "Sony",
    ticker: "SONY",
    solanaName: "SONY",
    venues: [...EQUITY_VENUES],
    price: 21.4,
    changePct: 0.011,
    line: "Sony stock on Solana. The sealed anniversary console is the product behind it.",
  },
  {
    id: "DIS",
    name: "Disney",
    ticker: "DIS",
    solanaName: "DIS",
    venues: [...EQUITY_VENUES],
    price: 96.2,
    changePct: 0.006,
    line: "Disney stock on Solana. The sealed park statue is the product behind it.",
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
    summary: "A sealed Vice City Collection box. The token is a claim on boxes stored in the vault.",
    objectLabel: "Sealed collector box",
    accent: "copper",
  },
  {
    id: "GTA_VINYL",
    stockId: "TTWO",
    name: "The Goodtime State — vinyl + hardware set",
    ticker: "GTA:VINYL",
    retailUsd: 149.99,
    twapUsd: 220,
    targetUnits: 800,
    oracleVenues: ["eBay sold", "Rockstar store"],
    prints: [
      { venue: "eBay sold", soldPrice: 210, daysAgo: 1 },
      { venue: "Rockstar store", soldPrice: 220, daysAgo: 4 },
      { venue: "eBay sold", soldPrice: 228, daysAgo: 6 },
      { venue: "eBay sold", soldPrice: 215, daysAgo: 9 },
      { venue: "Rockstar store", soldPrice: 220, daysAgo: 12 },
      { venue: "eBay sold", soldPrice: 227, daysAgo: 14 },
    ],
    summary: "A sealed vinyl and hardware set. The token is a claim on sets stored in the vault.",
    objectLabel: "Sealed vinyl set",
    accent: "ink",
  },
  {
    id: "RDR_BOX",
    stockId: "TTWO",
    name: "Red Dead Redemption 2 Collector’s Box — sealed",
    ticker: "RDR:BOX",
    retailUsd: 199.99,
    twapUsd: 310,
    targetUnits: 500,
    oracleVenues: ["eBay sold", "StockX"],
    prints: [
      { venue: "eBay sold", soldPrice: 298, daysAgo: 2 },
      { venue: "StockX", soldPrice: 322, daysAgo: 4 },
      { venue: "eBay sold", soldPrice: 310, daysAgo: 7 },
      { venue: "StockX", soldPrice: 305, daysAgo: 9 },
      { venue: "eBay sold", soldPrice: 318, daysAgo: 12 },
      { venue: "StockX", soldPrice: 307, daysAgo: 14 },
    ],
    summary: "A sealed collector box. The token is a claim on boxes stored in the vault.",
    objectLabel: "Sealed collector box",
    accent: "kraft",
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
    summary: "A sealed Nike pair, size 10. The token is a claim on pairs stored in the vault.",
    objectLabel: "Sealed pair, size 10",
    accent: "ink",
  },
  {
    id: "NKE_TRAVIS",
    stockId: "NKE",
    name: "Air Jordan 1 Low Travis Scott — sealed, size 10",
    ticker: "NKE:TRAVIS",
    retailUsd: 150,
    twapUsd: 980,
    targetUnits: 80,
    oracleVenues: ["StockX", "eBay sold"],
    prints: [
      { venue: "StockX", soldPrice: 960, daysAgo: 1 },
      { venue: "eBay sold", soldPrice: 1010, daysAgo: 3 },
      { venue: "StockX", soldPrice: 980, daysAgo: 6 },
      { venue: "eBay sold", soldPrice: 970, daysAgo: 8 },
      { venue: "StockX", soldPrice: 995, daysAgo: 11 },
      { venue: "eBay sold", soldPrice: 965, daysAgo: 14 },
    ],
    summary: "A sealed Travis Scott pair, size 10. The token is a claim on pairs stored in the vault.",
    objectLabel: "Sealed pair, size 10",
    accent: "gold",
  },
  {
    id: "NKE_OFFWHITE",
    stockId: "NKE",
    name: "Nike Dunk Low Off-White Lot 50 — sealed, size 10",
    ticker: "NKE:OW",
    retailUsd: 160,
    twapUsd: 740,
    targetUnits: 120,
    oracleVenues: ["StockX", "eBay sold"],
    prints: [
      { venue: "StockX", soldPrice: 720, daysAgo: 2 },
      { venue: "eBay sold", soldPrice: 760, daysAgo: 4 },
      { venue: "StockX", soldPrice: 740, daysAgo: 7 },
      { venue: "eBay sold", soldPrice: 735, daysAgo: 9 },
      { venue: "StockX", soldPrice: 752, daysAgo: 12 },
      { venue: "eBay sold", soldPrice: 733, daysAgo: 14 },
    ],
    summary: "A sealed Off-White pair, size 10. The token is a claim on pairs stored in the vault.",
    objectLabel: "Sealed pair, size 10",
    accent: "wrap",
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
    summary: "A sealed collector booster box. The token is a claim on boxes stored in the vault.",
    objectLabel: "Sealed booster box",
    accent: "gold",
  },
  {
    id: "HAS_POKEMON",
    stockId: "HAS",
    name: "Pokémon Scarlet & Violet 151 Booster Bundle — sealed",
    ticker: "HAS:151",
    retailUsd: 26.99,
    twapUsd: 62,
    targetUnits: 4000,
    oracleVenues: ["TCGPlayer sold", "eBay sold"],
    prints: [
      { venue: "TCGPlayer sold", soldPrice: 58, daysAgo: 1 },
      { venue: "eBay sold", soldPrice: 66, daysAgo: 3 },
      { venue: "TCGPlayer sold", soldPrice: 62, daysAgo: 6 },
      { venue: "eBay sold", soldPrice: 61, daysAgo: 9 },
      { venue: "TCGPlayer sold", soldPrice: 64, daysAgo: 12 },
      { venue: "eBay sold", soldPrice: 61, daysAgo: 14 },
    ],
    summary: "A sealed 151 bundle. The token is a claim on bundles stored in the vault.",
    objectLabel: "Sealed booster bundle",
    accent: "pip",
  },
  {
    id: "HAS_TRANSFORMERS",
    stockId: "HAS",
    name: "Transformers Masterpiece Optimus Prime — sealed",
    ticker: "HAS:OP",
    retailUsd: 199.99,
    twapUsd: 280,
    targetUnits: 300,
    oracleVenues: ["eBay sold", "Hasbro Pulse"],
    prints: [
      { venue: "eBay sold", soldPrice: 268, daysAgo: 2 },
      { venue: "Hasbro Pulse", soldPrice: 280, daysAgo: 5 },
      { venue: "eBay sold", soldPrice: 292, daysAgo: 7 },
      { venue: "eBay sold", soldPrice: 275, daysAgo: 10 },
      { venue: "Hasbro Pulse", soldPrice: 280, daysAgo: 12 },
      { venue: "eBay sold", soldPrice: 285, daysAgo: 14 },
    ],
    summary: "A sealed Masterpiece figure. The token is a claim on figures stored in the vault.",
    objectLabel: "Sealed figure",
    accent: "red",
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
    summary: "A sealed anniversary console. The token is a claim on consoles stored in the vault.",
    objectLabel: "Sealed console",
    accent: "cobalt",
  },
  {
    id: "SONY_PORTAL",
    stockId: "SONY",
    name: "PlayStation Portal 30th Anniversary — sealed",
    ticker: "SONY:PORTAL",
    retailUsd: 199.99,
    twapUsd: 340,
    targetUnits: 200,
    oracleVenues: ["eBay sold", "StockX"],
    prints: [
      { venue: "eBay sold", soldPrice: 330, daysAgo: 1 },
      { venue: "StockX", soldPrice: 350, daysAgo: 4 },
      { venue: "eBay sold", soldPrice: 340, daysAgo: 6 },
      { venue: "StockX", soldPrice: 335, daysAgo: 9 },
      { venue: "eBay sold", soldPrice: 348, daysAgo: 12 },
      { venue: "StockX", soldPrice: 337, daysAgo: 14 },
    ],
    summary: "A sealed Portal. The token is a claim on units stored in the vault.",
    objectLabel: "Sealed handheld",
    accent: "teal",
  },
  {
    id: "SONY_PSP",
    stockId: "SONY",
    name: "PSP 30th Anniversary Limited — sealed",
    ticker: "SONY:PSP",
    retailUsd: 249.99,
    twapUsd: 420,
    targetUnits: 150,
    oracleVenues: ["eBay sold", "StockX"],
    prints: [
      { venue: "eBay sold", soldPrice: 400, daysAgo: 2 },
      { venue: "StockX", soldPrice: 440, daysAgo: 5 },
      { venue: "eBay sold", soldPrice: 420, daysAgo: 7 },
      { venue: "StockX", soldPrice: 415, daysAgo: 10 },
      { venue: "eBay sold", soldPrice: 430, daysAgo: 12 },
      { venue: "StockX", soldPrice: 415, daysAgo: 14 },
    ],
    summary: "A sealed limited PSP. The token is a claim on units stored in the vault.",
    objectLabel: "Sealed handheld",
    accent: "black",
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
    summary: "A sealed park statue. The token is a claim on statues stored in the vault.",
    objectLabel: "Sealed statue",
    accent: "platinum",
  },
  {
    id: "DIS_LEGO",
    stockId: "DIS",
    name: "LEGO Disney Castle — sealed",
    ticker: "DIS:CASTLE",
    retailUsd: 399.99,
    twapUsd: 460,
    targetUnits: 400,
    oracleVenues: ["eBay sold", "shopDisney"],
    prints: [
      { venue: "eBay sold", soldPrice: 445, daysAgo: 1 },
      { venue: "shopDisney", soldPrice: 460, daysAgo: 4 },
      { venue: "eBay sold", soldPrice: 472, daysAgo: 7 },
      { venue: "shopDisney", soldPrice: 455, daysAgo: 9 },
      { venue: "eBay sold", soldPrice: 468, daysAgo: 12 },
      { venue: "shopDisney", soldPrice: 460, daysAgo: 14 },
    ],
    summary: "A sealed Disney Castle set. The token is a claim on sets stored in the vault.",
    objectLabel: "Sealed set",
    accent: "gold",
  },
  {
    id: "DIS_PIN",
    stockId: "DIS",
    name: "Disney100 limited pin box — sealed",
    ticker: "DIS:PIN",
    retailUsd: 79.99,
    twapUsd: 140,
    targetUnits: 900,
    oracleVenues: ["eBay sold", "shopDisney"],
    prints: [
      { venue: "eBay sold", soldPrice: 128, daysAgo: 2 },
      { venue: "shopDisney", soldPrice: 140, daysAgo: 5 },
      { venue: "eBay sold", soldPrice: 152, daysAgo: 7 },
      { venue: "eBay sold", soldPrice: 136, daysAgo: 10 },
      { venue: "shopDisney", soldPrice: 140, daysAgo: 12 },
      { venue: "eBay sold", soldPrice: 144, daysAgo: 14 },
    ],
    summary: "A sealed pin box. The token is a claim on boxes stored in the vault.",
    objectLabel: "Sealed pin box",
    accent: "cream",
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
