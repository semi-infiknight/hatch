"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatUsd } from "@/lib/format"
import { lifeState } from "@/lib/life"
import { useReserve } from "./reserve-provider"

const RAISE_MIN = 50_000
const RAISE_MAX = 5_000_000
const RAISE_STEP = 50_000

const FEE_CONTROLS = [
  { index: 0, label: "Object", id: "fee-object" },
  { index: 1, label: "Parent", id: "fee-equity" },
  { index: 2, label: "Buffer", id: "fee-buffer" },
] as const

const field =
  "flex flex-col gap-1 bg-[#E7EEF2] p-2 text-[#1C1915]"
const fieldInput =
  "h-10 border-[#1C1915]/20 bg-[#E7EEF2] font-mono text-[#1C1915] tabular-nums dark:bg-[#E7EEF2] dark:text-[#1C1915]"

function feePercent(fraction: number): string {
  if (!Number.isFinite(fraction)) return "—"
  const pct = Math.round(fraction * 1000) / 10
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`
}

function rebalanceFees(
  current: [number, number, number],
  index: 0 | 1 | 2,
  next: number,
): [number, number, number] {
  const clamped = Math.min(1, Math.max(0, next))
  const others = ([0, 1, 2] as const).filter((slot) => slot !== index)
  const rest = 1 - clamped
  const otherSum = current[others[0]] + current[others[1]]
  const out: [number, number, number] = [0, 0, 0]
  out[index] = clamped
  if (otherSum <= 1e-9) {
    out[others[0]] = rest / 2
    out[others[1]] = rest - rest / 2
  } else {
    out[others[0]] = (rest * current[others[0]]) / otherSum
    out[others[1]] = rest - out[others[0]]
  }
  return out
}

function sliderValue(value: number | readonly number[]): number {
  const raw = Array.isArray(value) ? value[0] : value
  return typeof raw === "number" && Number.isFinite(raw) ? raw : 0
}

export function LaunchPanel() {
  const { state, setTicker, setRaiseTarget, setFees, launch } = useReserve()
  const [raiseDraft, setRaiseDraft] = useState<string | null>(null)
  const fees: [number, number, number] = [state.feeSku, state.feeEquity, state.feeBuffer]
  const filled =
    state.raiseTarget > 0 ? Math.min(1, Math.max(0, state.raiseFilled / state.raiseTarget)) : 0
  const life = lifeState(state)

  function commitRaise(raw: string) {
    const next = Number(raw)
    if (Number.isFinite(next)) setRaiseTarget(next)
    setRaiseDraft(null)
  }

  function updateFee(index: 0 | 1 | 2, percent: number) {
    const [sku, equity, buffer] = rebalanceFees(fees, index, percent / 100)
    setFees(sku, equity, buffer)
  }

  return (
    <section aria-label="Launch" className="shrink-0 bg-[#2A2723] px-3 py-2.5 text-[#F3EBDD]">
      <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(7rem,0.7fr)_minmax(9rem,0.8fr)_minmax(18rem,1.7fr)_minmax(12rem,0.9fr)]">
        <div className={field}>
          <label htmlFor="launch-ticker" className="text-[13px] font-medium">
            Ticker
          </label>
          <Input
            id="launch-ticker"
            value={state.ticker}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => setTicker(event.target.value)}
            className={fieldInput}
          />
        </div>

        <div className={field}>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="launch-raise" className="text-[13px] font-medium">
              Raise target
            </label>
            <span className="font-mono text-[13px] tabular-nums">
              {formatUsd(state.raiseTarget)}
            </span>
          </div>
          <Input
            id="launch-raise"
            type="number"
            inputMode="numeric"
            min={RAISE_MIN}
            max={RAISE_MAX}
            step={RAISE_STEP}
            value={raiseDraft ?? state.raiseTarget}
            autoComplete="off"
            onChange={(event) => {
              setRaiseDraft(event.target.value)
              if (Number.isFinite(event.target.valueAsNumber)) {
                setRaiseTarget(event.target.valueAsNumber)
              }
            }}
            onBlur={(event) => commitRaise(event.target.value)}
            className={fieldInput}
          />
        </div>

        <fieldset className="flex min-w-0 flex-col gap-2 bg-[#E7EEF2] p-2 text-[#1C1915]">
          <legend className="text-[13px] font-medium">Fees</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {FEE_CONTROLS.map((control) => {
              const fraction = fees[control.index]
              return (
                <div key={control.id} className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <label htmlFor={control.id} className="text-[13px]">
                      {control.label}
                    </label>
                    <span className="font-mono text-[13px] tabular-nums">
                      {feePercent(fraction)}
                    </span>
                  </div>
                  <Slider
                    id={control.id}
                    aria-label={control.label}
                    min={0}
                    max={100}
                    step={0.1}
                    value={[fraction * 100]}
                    onValueChange={(next) => updateFee(control.index, sliderValue(next))}
                  />
                </div>
              )
            })}
          </div>
          <p className="text-[13px]">10% of the edition stays in the shell.</p>
        </fieldset>

        <div className="flex flex-col items-start gap-2 lg:items-end">
          <div className="flex flex-col items-start gap-0.5 lg:items-end">
            <span className="font-spine font-sans text-[11px] uppercase tracking-[0.16em]">
              {life}
            </span>
            <span className="font-mono text-[11px] text-[#C4B8A8]">{state.phase}</span>
          </div>

          {state.phase === "draft" ? (
            <Button
              type="button"
              className="min-h-10 bg-[#F3EBDD] text-[#1C1915] hover:bg-[#E7EEF2]"
              onClick={() => launch()}
            >
              Draw the pip
            </Button>
          ) : null}

          {state.phase === "filling" ? (
            <div className="flex w-full min-w-0 flex-col gap-1">
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-[#3A3530]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={state.raiseTarget}
                aria-valuenow={state.raiseFilled}
                aria-label="Raise filled"
              >
                <div
                  className="h-full bg-[#C9A227] motion-safe:transition-[width] motion-safe:duration-150"
                  style={{ width: `${filled * 100}%` }}
                />
              </div>
              <p className="font-mono text-[13px] tabular-nums lg:text-right">
                {formatUsd(state.raiseFilled)} / {formatUsd(state.raiseTarget)}
              </p>
            </div>
          ) : null}

          {state.phase === "live" ? (
            <div className="flex w-full flex-col items-start gap-2 lg:items-end">
              <p className="text-[13px]">
                The line is in{" "}
                <span className="font-mono tabular-nums">{formatUsd(state.raiseFilled)}</span>
              </p>
              <Button
                type="button"
                variant="ghost"
                className="min-h-10 text-[#F3EBDD] hover:bg-[#322E29] hover:text-[#F3EBDD]"
                onClick={() => launch()}
              >
                Seal it again
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
