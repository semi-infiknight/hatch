/**
 * VICE mainnet Meteora DBC config. Ready to pass into `buildCurve` / `createConfig`.
 * Does not create a pool or sign a transaction.
 *
 * Vault at graduation: 15% of the raise stays as a USDC buffer for storage,
 * shipping, and redemption. The other 85% buys sealed boxes.
 * 250_000 * 0.85 / 500 = 425 units at the working acquisition price.
 * At a $545 secondary print: 250_000 * 0.85 / 545 ≈ 390 units.
 * About 400 sealed Goodtime State / Vice City Collection boxes.
 *
 * Shape: Meteora `buildCurve` (@meteora-ag/dynamic-bonding-curve-sdk 1.5.13)
 * is one constant-product segment, not a linear price path. Spot prices of
 * $0.06 and $0.50 on 1_000_000 supply with a 100_000 leftover raise
 * 115_777.923501 USDC (`buildCurveWithMarketCap`), not 250_000. The multiple
 * stays 0.50 / 0.06 = 8.333×. Docs disagreed with parking both the $0.06/$0.50
 * levels and a 250_000 USDC integral on this supply.
 *
 * Scaled so the quote integral is 250_000 USDC: `sqrtStartPrice`, the
 * migration `sqrtPrice`, and the first segment `liquidity` are multiplied by
 * sqrt(250_000 / 115_777.923501). `migrationQuoteThreshold` itself is
 * 250_000 USDC (250_000_000_000 raw, 6 decimals). On-chain spot prices are
 * about $0.1296 to $1.0797. Passing `migrationQuoteThreshold: 250_000` straight
 * into `buildCurve` throws in SDK 1.5.13 (`Not enough liquidity`, 4 lamports
 * short) because the tail segment is checked too late. This curve's first
 * segment can collect 250_000.000001 USDC, so the 250_000 threshold is reachable.
 *
 * 100_000 tokens (10%) are leftover. They are not sold on the curve. The
 * leftover receiver withdraws them after migration. That is the reserve sleeve.
 */

export const VICE_GRADUATION_USDC = 250_000

/** Spot prices the raw sqrt fields encode, after the quote-threshold scale. */
export const VICE_START_PRICE_USD = 0.129558378256
export const VICE_END_PRICE_USD = 1.079653151656

/** Locked design levels. Constant-product math cannot also raise 250_000 USDC at these prices. */
export const VICE_DESIGN_START_PRICE_USD = 0.06
export const VICE_DESIGN_END_PRICE_USD = 0.5

export const VICE_SUPPLY = 1_000_000
export const VICE_LEFTOVER = 100_000
export const VICE_FEE_BPS = 100

/** Mainnet USDC. */
export const VICE_QUOTE_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

export const VICE_BASE_DECIMALS = 6
export const VICE_QUOTE_DECIMALS = 6

/**
 * Flat 100 bps. Valid on the current program: pre-graduation base fee is
 * 25–9900 bps, and a fixed fee is `startingFeeBps == endingFeeBps` with
 * `numberOfPeriod` and `totalDuration` both 0. Numerator denominator is
 * 1_000_000_000, so 100 bps is `cliffFeeNumerator` 10_000_000.
 * Dynamic fee is off, so volatility does not add to the 100 bps.
 *
 * The program takes 20% of the trading fee as protocol. `creatorTradingFeePercentage`
 * is 100, so the creator receives the other 80%. There is no on-chain split
 * for more SKU, parent stock, and the USDC buffer. Of that creator fee, the
 * off-chain reserve split is 50% more SKU, 30% parent stock, 20% USDC buffer.
 */
export const VICE_CREATOR_TRADING_FEE_PERCENTAGE = 100
export const VICE_FEE_SPLIT = {
  sku: 0.5,
  parent: 0.3,
  buffer: 0.2,
} as const

/**
 * Decimal integers for `BN`. Bigint literals are outside this repo's ES2017 target.
 * The tail segment parks the 155-raw-unit rounding remainder above migration.
 * `MAX_SQRT_PRICE` is the program constant.
 */
export const viceDbcRaw = {
  quoteMint: VICE_QUOTE_MINT,
  tokenBaseDecimal: VICE_BASE_DECIMALS,
  tokenQuoteDecimal: VICE_QUOTE_DECIMALS,
  /** 1_000_000 tokens at 6 decimals. */
  preMigrationTokenSupply: "1000000000000",
  postMigrationTokenSupply: "1000000000000",
  /** 100_000 tokens at 6 decimals. Not sold on the curve. */
  leftover: "100000000000",
  /** 250_000 USDC at 6 decimals. Graduation fires when quote reserve reaches this. */
  migrationQuoteThreshold: "250000000000",
  sqrtStartPrice: "6639761411941479632",
  curve: [
    {
      sqrtPrice: "19167340188430721310",
      liquidity: "6790665079663143001300000000000",
    },
    {
      sqrtPrice: "79226673521066979257578248091",
      liquidity: "2970937729925521932906",
    },
  ],
  cliffFeeNumerator: "10000000",
  baseFeeMode: 0,
  firstFactor: 0,
  secondFactor: "0",
  thirdFactor: "0",
  dynamicFee: null,
  collectFeeMode: 0,
  creatorTradingFeePercentage: VICE_CREATOR_TRADING_FEE_PERCENTAGE,
  migrationOption: 1,
  /** FixedBps100: graduated DAMM v2 LP fee is 1%. Not a cut of the 250_000 raise. */
  migrationFeeOption: 2,
  migrationFeePercentage: 0,
  partnerLiquidityPercentage: 0,
  partnerPermanentLockedLiquidityPercentage: 100,
  creatorLiquidityPercentage: 0,
  creatorPermanentLockedLiquidityPercentage: 0,
  tokenType: 0,
  tokenUpdateAuthority: 1,
  activationType: 1,
} as const
