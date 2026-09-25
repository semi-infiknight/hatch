"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CatalogRow, HatchMark } from "@/components/hatch/mark"
import { LaunchPanel } from "@/components/terminal/launch-panel"
import { ReserveProvider, useReserve } from "@/components/terminal/reserve-provider"
import { SkuPanel } from "@/components/terminal/sku-panel"
import { StockPanel } from "@/components/terminal/stock-panel"
import { VaultPanel } from "@/components/terminal/vault-panel"
import { fledgeWord, lifeState, shellPct } from "@/lib/life"
import type { SkuId, StockId } from "@/lib/catalog"

const STOCK_IDS = ["TTWO", "NKE", "HAS", "SONY", "DIS"] as const
const SKU_IDS = ["VICE", "NKE_DROP", "HAS_SET", "SONY_HW", "DIS_DROP"] as const

function isStockId(value: string | null): value is StockId {
  return value !== null && (STOCK_IDS as readonly string[]).includes(value)
}

function isSkuId(value: string | null): value is SkuId {
  return value !== null && (SKU_IDS as readonly string[]).includes(value)
}

function TerminalFrame() {
  const { stock, sku, state } = useReserve()
  const life = lifeState(state)

  return (
    <div className="flex h-[calc(100svh-3.5rem)] min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-[#2A2723] text-[#F3EBDD] supports-[height:100dvh]:h-[calc(100dvh-3.5rem)] supports-[height:100dvh]:min-h-[calc(100dvh-3.5rem)]">
      <header className="shrink-0 px-3 pt-3 pb-2">
        <div className="relative flex origin-top-left items-center gap-4 bg-[#F3EBDD] px-4 py-3 text-[#1C1915] [transform:rotate(-0.4deg)]">
          <span aria-hidden className="pointer-events-none absolute top-0 left-0 h-3 w-px bg-[#C9A227]" />
          <span aria-hidden className="pointer-events-none absolute top-0 left-0 h-px w-3 bg-[#C9A227]" />
          <HatchMark state={life} className="size-16 shrink-0 text-[#1C1915]" />
          <div className="min-w-0 flex-1">
            <CatalogRow k="NEST" v={stock.ticker} />
            <CatalogRow k="EGG" v={sku.ticker} />
            <CatalogRow k="STATE" v={life} />
            <CatalogRow k="SHELL" v={`${shellPct(life)}%`} />
            <CatalogRow k="FLEDGE" v={fledgeWord(life)} />
            <p className="pt-1 text-right font-mono text-[11px] text-[#1C1915]/55">{state.phase}</p>
          </div>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1">
        <div className="min-h-0 overflow-auto">
          <StockPanel />
        </div>
        <div className="min-h-0 overflow-auto">
          <SkuPanel />
        </div>
        <div className="min-h-0 overflow-auto">
          <VaultPanel />
        </div>
      </div>
      <LaunchPanel />
    </div>
  )
}

function TerminalDesk() {
  const searchParams = useSearchParams()
  const stockQuery = searchParams.get("stock")
  const skuQuery = searchParams.get("sku")
  const initialStock: StockId = isStockId(stockQuery) ? stockQuery : "TTWO"
  const initialSku: SkuId = isSkuId(skuQuery) ? skuQuery : "VICE"

  return (
    <ReserveProvider initialStock={initialStock} initialSku={initialSku}>
      <TerminalFrame />
    </ReserveProvider>
  )
}

export default function TerminalPage() {
  return (
    <Suspense fallback={null}>
      <TerminalDesk />
    </Suspense>
  )
}
