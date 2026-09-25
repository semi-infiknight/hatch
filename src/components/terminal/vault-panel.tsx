"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useReserve } from "@/components/terminal/reserve-provider"
import { formatCount, formatPct, formatToken, formatUsd } from "@/lib/format"
import { fledgeWord, lifeState, stateLine, unitsLine } from "@/lib/life"
import { cn } from "@/lib/utils"

function formatClock(at: number): string {
  if (!Number.isFinite(at)) return "\u2014"
  const date = new Date(at)
  const hh = String(date.getUTCHours()).padStart(2, "0")
  const mm = String(date.getUTCMinutes()).padStart(2, "0")
  const ss = String(date.getUTCSeconds()).padStart(2, "0")
  return `${hh}:${mm}:${ss}`
}

function wholeUnits(raw: string): number {
  if (!/^\d+$/.test(raw)) return 0
  const n = Number(raw)
  if (!Number.isFinite(n)) return 0
  return Math.floor(n)
}

const spine =
  "text-[11px] font-medium tracking-[0.16em] text-[#C4A574] uppercase"

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-[13px] leading-none text-[#C4A574]">{label}</dt>
      <dd className="min-w-0 font-mono text-sm leading-tight text-[#F3EBDD] tabular-nums">
        {children}
      </dd>
    </div>
  )
}

function CatalogField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className={spine}>{label}</dt>
      <dd className="min-w-0 text-[13px] leading-snug text-[#F3EBDD]">{children}</dd>
    </div>
  )
}

export function VaultPanel() {
  const { sku, state, nav, premium, tokensForOneUnit, redeem, deposit, sellPremium } =
    useReserve()
  const redeemId = useId()
  const depositId = useId()
  const logRef = useRef<HTMLDivElement>(null)
  const [redeemRaw, setRedeemRaw] = useState("1")
  const [depositRaw, setDepositRaw] = useState("1")

  const life = lifeState(state)
  const live = state.phase === "live"
  const redeemUnits = wholeUnits(redeemRaw)
  const depositUnits = wholeUnits(depositRaw)
  const tokensRequired = redeemUnits * tokensForOneUnit
  const mintApprox =
    nav > 0 && depositUnits > 0 ? (depositUnits * sku.twapUsd) / nav : Number.NaN
  const redeemDisabled = !live || redeemUnits < 1 || state.units < 1
  const depositDisabled = !live || depositUnits < 1
  const sleeveDisabled = !live || premium <= 0
  const target = sku.targetUnits
  const collectedPct =
    target > 0 ? Math.min(100, Math.max(0, (state.units / target) * 100)) : 0

  useEffect(() => {
    const viewport = logRef.current?.querySelector<HTMLElement>(
      "[data-slot='scroll-area-viewport']",
    )
    if (!viewport) return
    viewport.scrollTop = viewport.scrollHeight
  }, [state.events])

  return (
    <section
      aria-label="Vault"
      className="flex flex-col gap-3 rounded-md border border-[#C4A574]/40 bg-[#2A2723] p-3 text-[#F3EBDD]"
    >
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border border-[#C4A574]/50 p-2">
        <CatalogField label="Status">{stateLine(life)}</CatalogField>
        <CatalogField label="Vault fill">
          <span className="font-mono tabular-nums">{Math.round(collectedPct)}%</span>
        </CatalogField>
        <CatalogField label="Items in">
          <span className="font-mono tabular-nums">{unitsLine(state.units)}</span>
        </CatalogField>
        <CatalogField label="Redeem">
          <span className="font-mono tabular-nums">{fledgeWord(life)}</span>
        </CatalogField>
      </dl>

      <dl
        aria-live="polite"
        aria-atomic="true"
        className="grid grid-cols-2 gap-x-3 gap-y-2"
      >
        <Metric label="Units collected">
          {formatCount(state.units)}
          <span className="text-[#C4A574]"> / {formatCount(target)}</span>
        </Metric>
        <Metric label="USDC buffer">{formatUsd(state.usdcBuffer)}</Metric>
        <Metric label="NAV / token">{formatUsd(nav)}</Metric>
        <Metric label="Market">{formatUsd(state.marketPrice)}</Metric>
        <Metric label="Premium">
          <span
            className={cn(
              premium > 0 && "text-primary",
              premium < 0 && "text-negative",
            )}
          >
            {formatPct(premium)}
          </span>
        </Metric>
        <Metric label="Reserve sleeve">{formatToken(state.reserveTokens)}</Metric>
      </dl>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(collectedPct)}
        aria-label="Units collected toward target"
        className="h-[8px] overflow-hidden bg-[#C4A574]"
      >
        <div
          className="h-full bg-[#C9A227] motion-safe:transition-[width] motion-safe:duration-150 motion-safe:ease-out motion-reduce:transition-none"
          style={{ width: `${collectedPct}%` }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className={spine}>Vault log</h3>
        <div ref={logRef} className="h-48">
          <ScrollArea className="h-full border border-[#C4A574]/40">
            {state.events.length === 0 ? (
              <p className="px-2 py-3 text-[13px] text-[#C4A574]">Waiting first scan.</p>
            ) : (
              <ol className="flex flex-col px-2">
                {state.events.map((event) => (
                  <li
                    key={event.id}
                    className="grid grid-cols-[4.25rem_1fr] gap-x-2 border-b border-[#C4A574]/30 py-1.5 last:border-b-0"
                  >
                    <time
                      dateTime={new Date(event.at).toISOString()}
                      className="font-mono text-xs text-[#C4A574] tabular-nums"
                    >
                      {formatClock(event.at)}
                    </time>
                    <p className="text-[13px] leading-snug text-[#F3EBDD]">
                      <span className="font-mono tracking-[0.14em] text-[#C4A574]">SCAN</span>
                      <span className="px-1.5 text-[#C4A574]" aria-hidden="true">
                        /
                      </span>
                      {event.label}
                    </p>
                    <span className="col-start-2 font-mono text-xs text-[#C4A574] tabular-nums">
                      {formatCount(event.unitsDelta)} units
                      <span className="px-1.5" aria-hidden="true">
                        /
                      </span>
                      {formatUsd(event.usdcDelta)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </ScrollArea>
        </div>
      </div>

      <form
        className="flex flex-col gap-2 border-t border-[#C4A574]/40 pt-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (redeemDisabled) return
          redeem(tokensRequired)
        }}
      >
        <h3 className={spine}>Redeem</h3>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={redeemId} className="text-[#F3EBDD]">
            Items to redeem
          </Label>
          <Input
            id={redeemId}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            autoComplete="off"
            value={redeemRaw}
            onChange={(event) => {
              const next = event.target.value
              if (next === "" || /^\d+$/.test(next)) setRedeemRaw(next)
            }}
            className="min-h-10 border-[#C4A574]/50 bg-transparent font-mono text-[#F3EBDD] tabular-nums"
          />
        </div>
        <p className="text-[13px] text-[#C4A574]">
          Tokens required{" "}
          <span className="font-mono text-[#F3EBDD] tabular-nums">
            {formatToken(tokensRequired)}
          </span>
        </p>
        <Button type="submit" disabled={redeemDisabled} className="min-h-10 w-full">
          Redeem items
        </Button>
        <ul className="flex flex-col" aria-label="Redeem queue">
          {state.redeemQueue.length === 0 ? (
            <li className="text-[13px] text-[#C4A574]">
              Redeemed items show up here.
            </li>
          ) : (
            state.redeemQueue.map((order) => (
              <li
                key={order.id}
                className="grid grid-cols-[4.25rem_1fr_auto] items-baseline gap-2 border-b border-[#C4A574]/30 py-1.5 text-[13px] last:border-b-0"
              >
                <time
                  dateTime={new Date(order.at).toISOString()}
                  className="font-mono text-xs text-[#C4A574] tabular-nums"
                >
                  {formatClock(order.at)}
                </time>
                <span className="font-mono text-[#F3EBDD] tabular-nums">
                  {formatCount(order.units)} units
                </span>
                <span
                  className={cn(
                    "text-[#C4A574]",
                    order.status === "attesting" && "text-primary",
                  )}
                >
                  {order.status === "attesting" ? "Attesting" : "Shipped"}
                </span>
              </li>
            ))
          )}
        </ul>
      </form>

      <form
        className="flex flex-col gap-2 border-t border-[#C4A574]/40 pt-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (depositDisabled) return
          deposit(depositUnits)
        }}
      >
        <h3 className={spine}>Deposit</h3>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={depositId} className="text-[#F3EBDD]">
            Items to deposit
          </Label>
          <Input
            id={depositId}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            autoComplete="off"
            value={depositRaw}
            onChange={(event) => {
              const next = event.target.value
              if (next === "" || /^\d+$/.test(next)) setDepositRaw(next)
            }}
            className="min-h-10 border-[#C4A574]/50 bg-transparent font-mono text-[#F3EBDD] tabular-nums"
          />
        </div>
        <p className="text-[13px] text-[#C4A574]">
          Tokens to mint{" "}
          <span className="font-mono text-[#F3EBDD] tabular-nums">
            {formatToken(mintApprox)}
          </span>
        </p>
        <Button
          type="submit"
          variant="outline"
          disabled={depositDisabled}
          className="min-h-10 w-full border-[#C4A574]/60 bg-transparent text-[#F3EBDD] hover:bg-[#C4A574]/15 hover:text-[#F3EBDD]"
        >
          Deposit items
        </Button>
      </form>

      <div className="flex flex-col gap-2 border-t border-[#C4A574]/40 pt-3">
        <h3 className={spine}>Reserve tokens</h3>
        <Button
          type="button"
          variant="secondary"
          disabled={sleeveDisabled}
          className="min-h-10 w-full"
          onClick={() => {
            if (sleeveDisabled) return
            sellPremium()
          }}
        >
          Sell reserve tokens
        </Button>
        <p className="text-[13px] leading-snug text-[#C4A574]">
          {premium > 0
            ? "Token price is above the items. Selling reserve tokens buys more sealed items."
            : "Token price is at or below the items. Reserve tokens stay in the vault."}
        </p>
      </div>
    </section>
  )
}
