"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LaunchPanel } from "@/components/terminal/launch-panel"
import { ReserveProvider, useReserve } from "@/components/terminal/reserve-provider"
import { SkuPanel } from "@/components/terminal/sku-panel"
import { StockPanel } from "@/components/terminal/stock-panel"
import { VaultPanel } from "@/components/terminal/vault-panel"
import { fledgeWord, lifeState, plainStatus } from "@/lib/life"
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
    <div className="flex h-[calc(100svh-4rem)] min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-[#16343A] text-[#FFF6E8] supports-[height:100dvh]:h-[calc(100dvh-4rem)] supports-[height:100dvh]:min-h-[calc(100dvh-4rem)]">
      <header className="shrink-0 border-b border-[#FFF6E8]/10 px-4 py-3">
        <p className="font-spine text-[11px] tracking-[0.16em] text-[#F4D7B0] uppercase">Launchpad</p>
        <dl className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-[#F4D7B0]/70 uppercase">Company</dt>
            <dd className="font-mono text-sm">{stock.ticker}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-[#F4D7B0]/70 uppercase">Product</dt>
            <dd className="font-mono text-sm">{sku.ticker}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-[#F4D7B0]/70 uppercase">Status</dt>
            <dd className="text-sm">{plainStatus(life)}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-[#F4D7B0]/70 uppercase">Redeem</dt>
            <dd className="text-sm">{fledgeWord(life)}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-[#F4D7B0]/70 uppercase">Sale</dt>
            <dd className="text-sm">
              {state.phase === "live" ? "Filled" : state.phase === "filling" ? "Raising" : "Ready to start"}
            </dd>
          </div>
        </dl>
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
