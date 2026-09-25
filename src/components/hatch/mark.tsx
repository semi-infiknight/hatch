"use client"

import { useId, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const SHELL = "#F3EBDD"
const WRAP = "#E7EEF2"
const PIP = "#D6B7A0"
const KRAFT = "#C4A574"
const GOLD = "#C9A227"
const INK = "#1C1915"

const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)"
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

type HatchState = "nest" | "pip" | "hatch" | "fledge"

const WRAP_OPACITY: Record<Exclude<HatchState, "nest">, number> = {
  pip: 0.9,
  hatch: 0.2,
  fledge: 0.36,
}

export function HatchMark({
  className,
  state = "nest",
}: {
  className?: string
  state?: HatchState
}) {
  const uid = useId().replace(/:/g, "")
  const clipId = `hatch-shell-${uid}`
  const breathe = `hatch-breathe-${uid}`
  const pipGrow = `hatch-pip-${uid}`
  const open = state !== "nest"
  const reduce = useReducedMotion()

  return (
    <svg
      viewBox="0 0 64 64"
      width="64"
      height="64"
      aria-hidden="true"
      fill="none"
      className={cn(
        "block aspect-square overflow-visible text-[#1C1915]",
        className,
      )}
    >
      <style>
        {`        @keyframes ${breathe} {
          0%, 100% { opacity: 0.84; }
          50% { opacity: 0.94; }
        }
        @keyframes ${pipGrow} {
          from { stroke-dashoffset: 8; }
          to { stroke-dashoffset: 0; }
        }
        .${breathe} { animation: ${breathe} 4s ease-in-out infinite; }
        .${pipGrow} { animation: ${pipGrow} 700ms ${EASE_CSS} forwards; }
        @media (prefers-reduced-motion: reduce) {
          .${breathe} { animation: none; opacity: 0.9; }
          .${pipGrow} { animation: none; stroke-dashoffset: 0; }
        }`}
      </style>

      <ellipse cx="30" cy="55" rx="9" ry="1.25" fill="currentColor" opacity="0.16" />

      <motion.g
        initial={false}
        animate={{ y: state === "fledge" ? 4 : 0 }}
        transition={{ type: "tween", duration: reduce ? 0 : 0.9, ease: EASE }}
      >
        <defs>
          <clipPath id={clipId}>
            <ellipse cx="30" cy="31" rx="13" ry="19" />
          </clipPath>
        </defs>

        <ellipse cx="30" cy="31" rx="13" ry="19" fill={SHELL} />

        <g clipPath={`url(#${clipId})`}>
          <rect
            x="28"
            y="23"
            width="11"
            height="12"
            fill={KRAFT}
            stroke={INK}
            strokeWidth="0.35"
            style={{
              opacity: state === "hatch" ? 1 : 0,
              transition: `opacity 700ms ${EASE_CSS}`,
            }}
          />
        </g>

        <g
          clipPath={`url(#${clipId})`}
          className={state === "nest" ? breathe : undefined}
          style={
            state === "nest"
              ? undefined
              : {
                  opacity: WRAP_OPACITY[state],
                  transition: `opacity 800ms ${EASE_CSS}`,
                }
          }
        >
          <rect x="15" y="21" width="30" height="11" fill={WRAP} />
          <path
            d="M21 18.2C26 15.6 34 15.5 39.2 18.4"
            stroke={WRAP}
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        </g>

        <ellipse
          cx="30"
          cy="31"
          rx="13"
          ry="19"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.32"
        />

        <line
          x1="35.2"
          y1="17.5"
          x2="40.6"
          y2="23.4"
          stroke={PIP}
          strokeWidth="1.05"
          strokeLinecap="round"
          pathLength="8"
          strokeDasharray="8"
          strokeDashoffset="8"
          className={open ? pipGrow : undefined}
          style={{
            opacity: open ? 1 : 0,
            transition: `opacity 420ms ${EASE_CSS}`,
          }}
        />

        <g fill={INK} clipPath={`url(#${clipId})`}>
          <rect x="21" y="40" width="2" height="5" />
          <rect x="24" y="42" width="2" height="3" />
          <rect x="27" y="39" width="2" height="6" />
          <rect x="30" y="41" width="2" height="4" />
        </g>

        <g transform="rotate(-10 42 39)">
          <rect x="32" y="34.5" width="20" height="9" fill={GOLD} />
          <text
            x="42"
            y="39"
            textAnchor="middle"
            dominantBaseline="central"
            fill={INK}
            fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
            fontSize="6"
            fontWeight="500"
            letterSpacing="0.04em"
          >
            HATCH
          </text>
        </g>
      </motion.g>
    </svg>
  )
}

export function SpineWord({ children }: { children: ReactNode }) {
  return (
    <span className="font-spine uppercase tracking-[0.14em] text-ink">
      {children}
    </span>
  )
}

export function CatalogRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-2 items-baseline gap-3 border-b border-ink/10 py-1.5">
      <span className="font-spine text-[11px] uppercase tracking-[0.16em] text-ink">
        {k}
      </span>
      <span className="text-right font-mono text-[11px] text-ink">{v}</span>
    </div>
  )
}
