"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { getSku, getStock } from "@/lib/catalog"
import { formatUsd } from "@/lib/format"
import { LAUNCHES_KEY, loadLaunches, type LaunchRecord } from "@/lib/launches"
import { graduationUsdForSku } from "@/lib/dbc"

const empty: LaunchRecord[] = []
let cache: { raw: string | null; rows: LaunchRecord[] } = { raw: null, rows: empty }

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  return () => window.removeEventListener("storage", onStoreChange)
}

function getSnapshot() {
  const raw = window.localStorage.getItem(LAUNCHES_KEY)
  if (raw === cache.raw) return cache.rows
  const rows = loadLaunches()
  cache = { raw, rows }
  return rows
}

export function LiveSales() {
  const rows = useSyncExternalStore(subscribe, getSnapshot, () => empty)

  return (
    <section id="live" className="grid-layout">
      <h2 className="t-h3 col-span-full text-[var(--g1)] lg:col-start-2 2xl:col-start-3">
        Live sales
      </h2>
      {rows.length === 0 ? (
        <p className="t-h4 col-span-full text-[var(--w2)] lg:col-span-8 lg:col-start-2 2xl:col-start-3">
          Nothing is live yet. Open the launchpad, pick a company, pick a sealed product, and launch it.
        </p>
      ) : (
        <ul className="col-span-full grid grid-cols-1 gap-3 md:grid-cols-2 lg:col-start-2 lg:grid-cols-3 2xl:col-start-3">
          {rows.map((row) => {
            const stock = getStock(row.stockId)
            const sku = getSku(row.skuId)
            const href = `/terminal?stock=${row.stockId}&sku=${row.skuId}&mint=${row.mint}&pool=${row.pool}&tx=${row.tx}`
            return (
              <li key={row.pool} className="border border-[color-mix(in_srgb,var(--w1)_20%,transparent)] p-4">
                <Link href={href} className="flex flex-col gap-3 text-[var(--w1)]">
                  <span className="t-p text-[var(--g1)]">
                    {stock.ticker} · live
                  </span>
                  <span className="t-h3">
                    <span className="actionable">{row.symbol}</span>
                  </span>
                  <span className="t-h4 text-[var(--w2)]">{sku.name}</span>
                  <span className="t-p text-[var(--w2)]">
                    Raise {formatUsd(graduationUsdForSku(row.skuId), { compact: true })}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
