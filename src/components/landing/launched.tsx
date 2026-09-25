"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSku, getStock } from "@/lib/catalog"
import { formatUsd } from "@/lib/format"
import { loadLaunches, type LaunchRecord } from "@/lib/launches"
import { graduationUsdForSku } from "@/lib/dbc"

export function Launched() {
  const [rows, setRows] = useState<LaunchRecord[]>([])

  useEffect(() => {
    setRows(loadLaunches())
  }, [])

  return (
    <section id="live" className="border-t border-white/10 bg-[#0c0c0c] py-20 text-[#f5f5f5]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-letter text-4xl md:text-5xl">Live sales</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#f5f5f5]/65">
          Every sale that has been launched from this browser. Open a desk to watch the raise, then the vault.
        </p>
        {rows.length === 0 ? (
          <p className="mt-8 text-base text-[#f5f5f5]/55">
            Nothing is live yet. Open the launchpad, pick a company, pick a sealed product, and launch it.
          </p>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => {
              const stock = getStock(row.stockId)
              const sku = getSku(row.skuId)
              const href = `/terminal?stock=${row.stockId}&sku=${row.skuId}&mint=${row.mint}&pool=${row.pool}&tx=${row.tx}`
              return (
                <li key={row.pool}>
                  <Link
                    href={href}
                    className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-[#f5f5f5]"
                  >
                    <div>
                      <p className="font-spine text-[11px] tracking-[0.16em] text-[#E24B3B] uppercase">
                        {stock.ticker} · live
                      </p>
                      <h3 className="font-letter mt-2 text-2xl leading-tight">{row.symbol}</h3>
                      <p className="mt-1 text-sm text-[#f5f5f5]/60">{sku.name}</p>
                    </div>
                    <p className="mt-5 font-mono text-sm">
                      Raise {formatUsd(graduationUsdForSku(row.skuId), { compact: true })}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
