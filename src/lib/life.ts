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

export function plainStatus(state: LifeState): string {
  if (state === "nest") return "Not launched"
  if (state === "pip") return "Sale in progress"
  if (state === "hatch") return "Items in the vault"
  return "Ready to redeem"
}

export function stateLine(state: LifeState): string {
  return plainStatus(state)
}

export function fledgeWord(state: LifeState): "Closed" | "Open" {
  return state === "fledge" ? "Open" : "Closed"
}

export function unitsLine(units: number): string {
  return units <= 0 ? "Waiting for the first item" : String(units)
}
