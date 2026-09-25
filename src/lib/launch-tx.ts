import { DynamicBondingCurveClient, deriveDbcPoolAddress } from "@meteora-ag/dynamic-bonding-curve-sdk"
import { Connection, Keypair, PublicKey, type Transaction } from "@solana/web3.js"
import BN from "bn.js"
import { viceDbcRaw } from "@/lib/dbc"

const zeroBn = new BN(0)

const vesting = {
  vestingPercentage: 0,
  bpsPerPeriod: 0,
  numberOfPeriods: 0,
  cliffDurationFromMigrationTime: 0,
  frequency: 0,
}

export const MAINNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC ?? "https://api.mainnet-beta.solana.com"

export function mainnetConnection() {
  return new Connection(MAINNET_RPC, "confirmed")
}

export async function buildViceLaunchTransaction(input: {
  payer: PublicKey
  name: string
  symbol: string
  uri: string
  connection: Connection
}): Promise<{
  transaction: Transaction
  config: Keypair
  baseMint: Keypair
  pool: PublicKey
}> {
  const config = Keypair.generate()
  const baseMint = Keypair.generate()
  const client = new DynamicBondingCurveClient(input.connection, "confirmed")
  const raw = viceDbcRaw

  const transaction = await client.partner.createConfigAndPool({
    payer: input.payer,
    config: config.publicKey,
    feeClaimer: input.payer,
    leftoverReceiver: input.payer,
    quoteMint: new PublicKey(raw.quoteMint),
    poolFees: {
      baseFee: {
        cliffFeeNumerator: new BN(raw.cliffFeeNumerator),
        firstFactor: raw.firstFactor,
        secondFactor: new BN(raw.secondFactor),
        thirdFactor: new BN(raw.thirdFactor),
        baseFeeMode: raw.baseFeeMode,
      },
      dynamicFee: null,
    },
    collectFeeMode: raw.collectFeeMode,
    migrationOption: raw.migrationOption,
    activationType: raw.activationType,
    tokenType: raw.tokenType,
    tokenDecimal: raw.tokenBaseDecimal,
    partnerLiquidityPercentage: raw.partnerLiquidityPercentage,
    partnerPermanentLockedLiquidityPercentage: raw.partnerPermanentLockedLiquidityPercentage,
    creatorLiquidityPercentage: raw.creatorLiquidityPercentage,
    creatorPermanentLockedLiquidityPercentage: raw.creatorPermanentLockedLiquidityPercentage,
    migrationQuoteThreshold: new BN(raw.migrationQuoteThreshold),
    sqrtStartPrice: new BN(raw.sqrtStartPrice),
    lockedVesting: {
      amountPerPeriod: zeroBn,
      cliffDurationFromMigrationTime: zeroBn,
      frequency: zeroBn,
      numberOfPeriod: zeroBn,
      cliffUnlockAmount: zeroBn,
    },
    migrationFeeOption: raw.migrationFeeOption,
    tokenSupply: {
      preMigrationTokenSupply: new BN(raw.preMigrationTokenSupply),
      postMigrationTokenSupply: new BN(raw.postMigrationTokenSupply),
    },
    creatorTradingFeePercentage: raw.creatorTradingFeePercentage,
    tokenUpdateAuthority: raw.tokenUpdateAuthority,
    migrationFee: {
      feePercentage: raw.migrationFeePercentage,
      creatorFeePercentage: 0,
    },
    poolCreationFee: new BN(1_000_000),
    creatorLiquidityVestingInfo: vesting,
    partnerLiquidityVestingInfo: vesting,
    migratedPoolBaseFeeMode: 0,
    migratedPoolMarketCapFeeSchedulerParams: {
      numberOfPeriod: 0,
      sqrtPriceStepBps: 0,
      schedulerExpirationDuration: 0,
      reductionFactor: zeroBn,
    },
    padding: [],
    curve: raw.curve.map((point) => ({
      sqrtPrice: new BN(point.sqrtPrice),
      liquidity: new BN(point.liquidity),
    })),
    enableFirstSwapWithMinFee: false,
    compoundingFeeBps: 0,
    migratedPoolFee: {
      dynamicFee: 0,
      poolFeeBps: 0,
      collectFeeMode: 0,
    },
    preCreatePoolParam: {
      baseMint: baseMint.publicKey,
      name: input.name,
      symbol: input.symbol,
      uri: input.uri,
      poolCreator: input.payer,
    },
  })

  const { blockhash } = await input.connection.getLatestBlockhash("confirmed")
  transaction.recentBlockhash = blockhash
  transaction.feePayer = input.payer
  transaction.partialSign(config, baseMint)

  const pool = deriveDbcPoolAddress(
    new PublicKey(raw.quoteMint),
    baseMint.publicKey,
    config.publicKey,
  )

  return { transaction, config, baseMint, pool }
}
