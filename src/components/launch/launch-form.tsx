"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PublicKey, type Transaction } from "@solana/web3.js"
import { formatUsd } from "@/lib/format"
import {
  VICE_END_PRICE_USD,
  VICE_FEE_BPS,
  VICE_GRADUATION_USDC,
  VICE_START_PRICE_USD,
  VICE_SUPPLY,
} from "@/lib/dbc"

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

export function LaunchForm() {
  const router = useRouter()
  const [name, setName] = useState("Vice City Collection")
  const [symbol, setSymbol] = useState("VICE")
  const [wallet, setWallet] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const payer = "publicKey" in connected && connected.publicKey
        ? connected.publicKey
        : provider.publicKey
      if (!payer) throw new Error("Wallet has no public key.")
      setWallet(payer.toBase58())

      const { buildViceLaunchTransaction, mainnetConnection } = await import("@/lib/launch-tx")
      const connection = mainnetConnection()
      const uri = `${window.location.origin}/api/metadata?name=${encodeURIComponent(cleanName)}&symbol=${encodeURIComponent(cleanSymbol)}`
      const built = await buildViceLaunchTransaction({
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
      const params = new URLSearchParams({
        stock: "TTWO",
        sku: "VICE",
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
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-12">
        <div>
          <p className="font-spine text-xs tracking-[0.16em] text-[#E24B3B] uppercase">Launchpad</p>
          <h1 className="font-letter mt-2 text-5xl">Launch</h1>
          <p className="mt-3 text-base leading-relaxed text-[#2A1A14]/80">
            This creates a real Meteora curve on Solana mainnet. People buy the token with USDC.
            The sale ends at {formatUsd(VICE_GRADUATION_USDC, { compact: true })}. That money is what buys the sealed boxes.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-3xl border-[6px] border-[#5C3317] bg-[#FFF6E8] p-5"
          onSubmit={(event) => {
            event.preventDefault()
            void launch()
          }}
        >
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
              <dd className="font-mono">{formatUsd(VICE_GRADUATION_USDC, { compact: true })} USDC</dd>
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
              <dd>Sealed Vice City box</dd>
            </div>
          </dl>

          <p className="text-sm text-[#2A1A14]/70">
            Your wallet pays the network fee and 0.001 SOL to open the curve. You keep the trading fees and the 10% that is not sold.
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
            {busy ? "Confirm in Phantom…" : "Launch"}
          </button>
          {error ? <p className="text-sm text-[#E24B3B]">{error}</p> : null}
        </form>
      </div>
    </main>
  )
}
