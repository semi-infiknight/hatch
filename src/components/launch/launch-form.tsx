"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PublicKey, type Transaction } from "@solana/web3.js"
import { formatUsd } from "@/lib/format"
import {
  VICE_END_PRICE_USD,
  VICE_FEE_BPS,
  VICE_START_PRICE_USD,
  VICE_SUPPLY,
  graduationUsdForSku,
} from "@/lib/dbc"
import {
  SKUS,
  STOCKS,
  getSku,
  getStock,
  skusFor,
  type SkuId,
  type StockId,
} from "@/lib/catalog"
import { saveLaunch, tickerSymbol } from "@/lib/launches"

type PhantomProvider = {
  isPhantom?: boolean
  publicKey: PublicKey | null
  connect: () => Promise<{ publicKey: PublicKey }>
  signTransaction: (transaction: Transaction) => Promise<Transaction>
}

function phantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null
  const provider = (window as Window & { solana?: PhantomProvider }).solana
  if (!provider?.isPhantom) return null
  return provider
}

function isStockId(value: string | null): value is StockId {
  return Boolean(value && STOCKS.some((stock) => stock.id === value))
}

function isSkuId(value: string | null): value is SkuId {
  return Boolean(value && SKUS.some((sku) => sku.id === value))
}

export function LaunchForm() {
  const router = useRouter()
  const search = useSearchParams()
  const firstStock = isStockId(search.get("stock")) ? search.get("stock") : "TTWO"
  const firstSku = isSkuId(search.get("sku")) ? search.get("sku") : "VICE"
  const [stockId, setStockId] = useState<StockId>(firstStock as StockId)
  const [skuId, setSkuId] = useState<SkuId>(
    skusFor(firstStock as StockId).some((sku) => sku.id === firstSku) ? (firstSku as SkuId) : skusFor(firstStock as StockId)[0].id,
  )
  const sku = getSku(skuId)
  const stock = getStock(stockId)
  const items = useMemo(() => skusFor(stockId), [stockId])
  const [name, setName] = useState(sku.name.slice(0, 32))
  const [symbol, setSymbol] = useState(tickerSymbol(sku.ticker))
  const [wallet, setWallet] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const raise = graduationUsdForSku(skuId)

  function pickStock(next: StockId) {
    setStockId(next)
    const first = skusFor(next)[0]
    setSkuId(first.id)
    setName(first.name.slice(0, 32))
    setSymbol(tickerSymbol(first.ticker))
  }

  function pickSku(next: SkuId) {
    const chosen = getSku(next)
    setSkuId(next)
    setName(chosen.name.slice(0, 32))
    setSymbol(tickerSymbol(chosen.ticker))
  }

  async function connect() {
    const provider = phantom()
    if (!provider) {
      setError("Install Phantom, then connect it.")
      return
    }
    const result = await provider.connect()
    setWallet(result.publicKey.toBase58())
    setError(null)
  }

  async function launch() {
    const provider = phantom()
    if (!provider) {
      setError("Install Phantom, then connect it.")
      return
    }
    const cleanName = name.trim()
    const cleanSymbol = symbol.trim().toUpperCase()
    if (cleanName.length < 1 || cleanName.length > 32) {
      setError("Name must be 1–32 characters.")
      return
    }
    if (!/^[A-Z0-9]{1,10}$/.test(cleanSymbol)) {
      setError("Ticker must be 1–10 letters or numbers.")
      return
    }

    setBusy(true)
    setError(null)
    try {
      const connected = wallet ? provider : await provider.connect()
      const payer =
        "publicKey" in connected && connected.publicKey ? connected.publicKey : provider.publicKey
      if (!payer) throw new Error("Wallet has no public key.")
      setWallet(payer.toBase58())

      const { buildLaunchTransaction, mainnetConnection } = await import("@/lib/launch-tx")
      const connection = mainnetConnection()
      const uri = `${window.location.origin}/api/metadata?name=${encodeURIComponent(cleanName)}&symbol=${encodeURIComponent(cleanSymbol)}`
      const built = await buildLaunchTransaction({
        payer,
        name: cleanName,
        symbol: cleanSymbol,
        uri,
        connection,
      })
      const signed = await provider.signTransaction(built.transaction)
      const signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
      })
      await connection.confirmTransaction(signature, "confirmed")
      saveLaunch({
        stockId,
        skuId,
        name: cleanName,
        symbol: cleanSymbol,
        mint: built.baseMint.publicKey.toBase58(),
        pool: built.pool.toBase58(),
        tx: signature,
        launchedAt: Date.now(),
      })
      const params = new URLSearchParams({
        stock: stockId,
        sku: skuId,
        mint: built.baseMint.publicKey.toBase58(),
        pool: built.pool.toBase58(),
        tx: signature,
      })
      router.push(`/terminal?${params.toString()}`)
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Launch failed."
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#F4D7B0] text-[#2A1A14]">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
        <div>
          <p className="font-spine text-xs tracking-[0.16em] text-[#E24B3B] uppercase">Launchpad</p>
          <h1 className="font-letter mt-2 text-5xl">Launch</h1>
          <p className="mt-3 text-base leading-relaxed text-[#2A1A14]/80">
            Pick the company stock. Then pick one sealed product from that company. Launch opens a real Meteora sale on Solana. After it confirms, you go to that product’s desk and wait for the raise to fill.
          </p>
        </div>

        <form
          className="flex flex-col gap-5 rounded-3xl border-[6px] border-[#5C3317] bg-[#FFF6E8] p-5"
          onSubmit={(event) => {
            event.preventDefault()
            void launch()
          }}
        >
          <fieldset>
            <legend className="mb-2 text-sm font-medium">1. Company stock</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {STOCKS.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => pickStock(row.id)}
                  className={`min-h-12 rounded-xl border px-2 text-sm ${
                    row.id === stockId
                      ? "border-[#E24B3B] bg-[#E24B3B] text-[#FFF6E8]"
                      : "border-[#5C3317]/20 bg-white"
                  }`}
                >
                  {row.ticker}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-[#2A1A14]/70">{stock.line}</p>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">2. Sealed product</legend>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => pickSku(item.id)}
                    className={`flex w-full flex-col items-start rounded-xl border px-3 py-2 text-left ${
                      item.id === skuId
                        ? "border-[#E24B3B] bg-[#F4D7B0]"
                        : "border-[#5C3317]/20 bg-white"
                    }`}
                  >
                    <span className="font-mono text-sm">{item.ticker}</span>
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-[#2A1A14]/60">{item.objectLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              value={name}
              maxLength={32}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-xl border border-[#5C3317]/20 bg-white px-3 text-base"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Ticker
            <input
              value={symbol}
              maxLength={10}
              onChange={(event) => setSymbol(event.target.value.toUpperCase())}
              className="h-12 rounded-xl border border-[#5C3317]/20 bg-white px-3 font-mono text-base uppercase"
            />
          </label>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[#2A1A14]/60">Raises</dt>
              <dd className="font-mono">{formatUsd(raise, { compact: true })} USDC</dd>
            </div>
            <div>
              <dt className="text-[#2A1A14]/60">Fee</dt>
              <dd className="font-mono">{VICE_FEE_BPS / 100}%</dd>
            </div>
            <div>
              <dt className="text-[#2A1A14]/60">Start price</dt>
              <dd className="font-mono">${VICE_START_PRICE_USD.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-[#2A1A14]/60">End price</dt>
              <dd className="font-mono">${VICE_END_PRICE_USD.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-[#2A1A14]/60">Supply</dt>
              <dd className="font-mono">{VICE_SUPPLY.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-[#2A1A14]/60">Product</dt>
              <dd>{sku.objectLabel}</dd>
            </div>
          </dl>

          <p className="text-sm text-[#2A1A14]/70">
            Your wallet pays the network fee and 0.001 SOL to open the curve. You keep the trading fees and the 10% that is not sold. After it launches, the desk waits for the raise to fill, then the vault can buy this product.
          </p>

          {wallet ? (
            <p className="truncate font-mono text-xs text-[#2A1A14]/70">{wallet}</p>
          ) : (
            <button
              type="button"
              onClick={() => void connect()}
              className="h-12 rounded-full border border-[#5C3317] text-base"
            >
              Connect Phantom
            </button>
          )}

          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-full bg-[#E24B3B] text-base font-medium text-[#FFF6E8] disabled:opacity-60"
          >
            {busy ? "Confirm in Phantom…" : `Launch ${symbol}`}
          </button>
          {error ? <p className="text-sm text-[#E24B3B]">{error}</p> : null}
        </form>
      </div>
    </main>
  )
}
