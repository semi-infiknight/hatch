"use client"

import {
  formatMultiple,
  formatPct,
  formatToken,
  formatUsd,
  formatUsdPrice,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import { useReserve } from "./reserve-provider"

const shelfLabel =
  "font-spine font-sans text-[11px] uppercase tracking-[0.16em]"

function changeTone(changePct: number) {
  if (!Number.isFinite(changePct) || changePct === 0) return "text-[#C4B8A8]"
  return changePct > 0 ? "text-positive" : "text-negative"
}

export function StockPanel() {
  const { stock, sku, stocks, state, stockPrice, selectStock } = useReserve()
  const objectPerEquity = stock.price > 0 ? sku.twapUsd / stock.price : Number.NaN
  const shareValue = state.parentShares * stockPrice

  return (
    <section
      aria-label="Company stock"
      className="flex flex-col gap-2 border border-[#3A3530] bg-[#2A2723] p-3 text-[#F3EBDD]"
    >
      <h2 className={shelfLabel}>Company stock</h2>

      {stocks.length === 0 ? (
        <p className="text-[13px] text-[#C4B8A8]">No equities listed.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {stocks.map((row) => {
            const selected = row.id === stock.id
            return (
              <li key={row.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectStock(row.id)}
                  className={cn(
                    "flex min-h-10 w-full items-center gap-2 border-l-2 px-2 text-left outline-none",
                    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]",
                    selected
                      ? "border-l-[#C9A227] bg-[#322E29]"
                      : "border-l-transparent hover:bg-[#322E29]",
                  )}
                >
                  <span className="w-12 shrink-0 font-mono text-[13px] tabular-nums">
                    {row.ticker}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-[#C4B8A8]">
                    {row.name}
                  </span>
                  <span className="font-mono text-[13px] tabular-nums">
                    {formatUsdPrice(row.price)}
                  </span>
                  <span
                    className={cn(
                      "w-16 shrink-0 text-right font-mono text-[13px] tabular-nums",
                      changeTone(row.changePct),
                    )}
                  >
                    {formatPct(row.changePct)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex flex-col gap-2 border-t border-[#3A3530] pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[13px] tabular-nums">{stock.solanaName}</p>
          <ul aria-label="Venues" className="flex flex-wrap gap-1">
            {stock.venues.map((venue) => (
              <li
                key={venue}
                className="bg-[#E7EEF2] px-1.5 py-0.5 text-[11px] leading-none text-[#2A2723]"
              >
                {venue}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[13px] leading-snug">{stock.line}</p>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <p className={shelfLabel}>Product / company</p>
          <p className="truncate font-mono text-[13px] tabular-nums">
            {sku.ticker} / {stock.ticker}
          </p>
        </div>
        <p className="shrink-0 font-mono text-[13px] tabular-nums">
          {formatMultiple(objectPerEquity)}
        </p>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <p className={shelfLabel}>Company stock bought</p>
        <p className="text-right font-mono text-[13px] tabular-nums">
          <span>{formatToken(state.parentShares)}</span>
          <span className="px-1 text-[#C4B8A8]">·</span>
          <span>{formatUsd(shareValue)}</span>
        </p>
      </div>
    </section>
  )
}
