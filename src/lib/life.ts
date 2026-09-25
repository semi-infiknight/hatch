import type { ReserveState } from "@/lib/reserve-sim"

export type LifeState = "nest" | "pip" | "hatch" | "fledge"

export function lifeState(s: Pick<ReserveState, "phase" | "units">): LifeState {
  if (s.phase === "draft") return "nest"
  if (s.phase === "filling") return "pip"
  if (s.units <= 0) return "pip"
  if (s.units < 12) return "hatch"
  return "fledge"
}

export function shellPct(state: LifeState): number {
  if (state === "nest") return 100
  if (state === "pip") return 96
  if (state === "hatch") return 42
  return 8
}

export function stateLine(state: LifeState): string {
  if (state === "nest") return "Still in the nest."
  if (state === "pip") return "A line in the wrap."
  if (state === "hatch") return "First unit in."
  return "Ready to fledge."
}

export function fledgeWord(state: LifeState): "closed" | "open" {
  return state === "fledge" ? "open" : "closed"
}

export function unitsLine(units: number): string {
  return units <= 0 ? "waiting first scan" : String(units)
}
