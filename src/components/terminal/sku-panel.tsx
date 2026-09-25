"use client"

import { useEffect, useState, type ClipboardEvent, type KeyboardEvent } from "react"
import { HatchMark } from "@/components/hatch/mark"
import { getStock } from "@/lib/catalog"
import { formatCount, formatUsd } from "@/lib/format"
import { lifeState } from "@/lib/life"
import { useReserve } from "./reserve-provider"

function shortSkuName(name: string): string {
  const splitAt = name.indexOf(" — ")
  return splitAt > 0 ? name.slice(0, splitAt) : name
}

function cents(value: number): number {
  return Math.round(value * 100)
}

function copyRaw(value: number) {
  return (event: ClipboardEvent<HTMLElement>) => {
    event.preventDefault()
    event.clipboardData.setData("text/plain", String(value))
  }
}

const hairline = "border-[#F3EBDD]/12"

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-[#F3EBDD]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A2723] focus-visible:outline-none"

const slipCell = `border px-1.5 py-0.5 ${hairline}`

export function SkuPanel() {
  const { sku, skuOptions, state, selectSku } = useReserve()
  const [tapeSeconds, setTapeSeconds] = useState(0)

  useEffect(() => {
    const started = Date.now()
    const timer = window.setInterval(() => {
      setTapeSeconds(Math.floor((Date.now() - started) / 1000))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const stock = getStock(sku.stockId)

  const showMark = cents(state.twap) !== cents(sku.twapUsd)

  function moveSku(event: KeyboardEvent<HTMLDivElement>) {
    if (skuOptions.length < 2) return
    const current = skuOptions.findIndex((option) => option.id === sku.id)
    const origin = current < 0 ? 0 : current
    let nextIndex = origin
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (origin + 1) % skuOptions.length
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (origin - 1 + skuOptions.length) % skuOptions.length
    } else {
      return
    }
    event.preventDefault()
    const next = skuOptions[nextIndex]
    selectSku(next.id)
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-sku="${next.id}"]`)?.focus()
  }

  return (
    <section
      aria-label="Egg"
      className={`flex flex-col gap-2 border bg-[#2A2723] p-3 text-[13px] leading-tight text-[#F3EBDD] ${hairline}`}
    >
      <p className="font-medium tracking-[0.16em] text-[#F3EBDD]/70 uppercase">EGG</p>

      <div
        role="radiogroup"
        aria-label="SKU"
        className="flex flex-col gap-1"
        onKeyDown={moveSku}
      >
        {skuOptions.map((option) => {
          const selected = option.id === sku.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              data-sku={option.id}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectSku(option.id)}
              className={`flex min-h-10 w-full flex-wrap items-baseline gap-x-2 border-y border-r border-l-2 px-2 py-1.5 text-left ${hairline} ${focusRing} ${
                selected
                  ? "border-l-[#F3EBDD] bg-[#F3EBDD]/8"
                  : "border-l-transparent hover:bg-[#F3EBDD]/6"
              }`}
            >
              <span className="shrink-0 font-mono text-[#F3EBDD]">{option.ticker}</span>
              <span className="min-w-0 text-[#F3EBDD]/65">{shortSkuName(option.name)}</span>
            </button>
          )
        })}
      </div>

      <div className={`flex flex-col gap-1.5 border-t pt-2 ${hairline}`}>
        <div className="flex items-center gap-3">
          <HatchMark className="size-16 shrink-0" state={lifeState(state)} />
          <p className="font-mono text-[12px] leading-snug tracking-[0.16em] uppercase">
            <span className="block">NEST {stock.ticker}</span>
            <span className="block">EGG {sku.ticker}</span>
          </p>
        </div>
        <p className="font-medium tracking-tight">{sku.name}</p>
        <p className="text-[#F3EBDD]/65">{sku.objectLabel}</p>
        <dl className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-0.5">
          <dt className="text-[#F3EBDD]/65">Retail</dt>
          <dd className="text-right font-mono" onCopy={copyRaw(sku.retailUsd)}>
            {formatUsd(sku.retailUsd)}
          </dd>
          <dt className="text-[#F3EBDD]/65">TWAP</dt>
          <dd className="text-right font-mono" onCopy={copyRaw(sku.twapUsd)}>
            {formatUsd(sku.twapUsd)}
          </dd>
          <dt className="text-[#F3EBDD]/65">Target units</dt>
          <dd className="text-right font-mono" onCopy={copyRaw(sku.targetUnits)}>
            {formatCount(sku.targetUnits)}
          </dd>
        </dl>
        <p className="leading-snug">{sku.summary}</p>
      </div>

      <div className={`flex flex-col gap-1.5 border-t pt-2 ${hairline}`}>
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-medium tracking-[0.16em] text-[#F3EBDD]/70 uppercase">14-DAY TAPE</h2>
          <p className="font-mono text-[#F3EBDD]">
            <span className="text-[#F3EBDD]/65">Tape</span>{" "}
            <span className="inline-block min-w-[3ch] text-right tabular-nums">{tapeSeconds}s</span>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[#F3EBDD]/65">
          {sku.oracleVenues.map((venue) => (
            <li key={venue}>{venue}</li>
          ))}
        </ul>
        <table className={`w-full border-collapse border ${hairline}`}>
          <caption className="sr-only">Sold comps for the 14-day TWAP</caption>
          <thead>
            <tr className="text-[#F3EBDD]/65">
              <th scope="col" className={`${slipCell} text-left font-medium`}>
                Venue
              </th>
              <th scope="col" className={`${slipCell} text-right font-medium`}>
                Sold
              </th>
              <th scope="col" className={`${slipCell} w-12 text-right font-medium`}>
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {sku.prints.map((print) => (
              <tr key={`${print.venue}-${print.daysAgo}-${print.soldPrice}`}>
                <td className={slipCell}>{print.venue}</td>
                <td className={`${slipCell} text-right font-mono`} onCopy={copyRaw(print.soldPrice)}>
                  {formatUsd(print.soldPrice)}
                </td>
                <td className={`${slipCell} text-right font-mono`}>{print.daysAgo}d</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className={`${slipCell} text-left font-medium`}>
                TWAP
              </th>
              <td className={`${slipCell} text-right font-mono`} onCopy={copyRaw(sku.twapUsd)}>
                {formatUsd(sku.twapUsd)}
              </td>
              <td className={slipCell} />
            </tr>
            {showMark ? (
              <tr>
                <th scope="row" className={`${slipCell} text-left font-medium`}>
                  Mark
                </th>
                <td className={`${slipCell} text-right font-mono`} onCopy={copyRaw(state.twap)}>
                  {formatUsd(state.twap)}
                </td>
                <td className={slipCell} />
              </tr>
            ) : null}
          </tfoot>
        </table>
      </div>
    </section>
  )
}
