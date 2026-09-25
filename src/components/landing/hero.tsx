"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { CatalogRow, HatchMark, SpineWord } from "@/components/hatch/mark"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const RECEIPT = [
  ["NEST", "TTWO"],
  ["EGG", "VICE"],
  ["STATE", "PIP"],
  ["SHELL", "96%"],
  ["UNITS IN", "waiting first scan"],
  ["FLEDGE", "closed"],
] as const

const SPINE = ["Still sealed", "Pip at the raise", "First unit in"] as const

export function Hero() {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (reduce) return

    const timers = [
      setTimeout(() => setStage(1), 80),
      setTimeout(() => setStage(2), 360),
    ]

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [reduce])

  const still = Boolean(reduce)

  return (
    <section className="bg-[#F3EBDD] text-[#1C1915]" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <p>
          <SpineWord>Live seal</SpineWord>
        </p>

        <h1
          id="hero-heading"
          className="font-letter mt-5 max-w-xl text-4xl leading-[1.15] font-normal text-[#1C1915] md:text-5xl"
        >
          Sealed until it’s alive.
        </h1>
        <p className="font-letter mt-3 max-w-md text-xl leading-snug text-[#1C1915]/75 md:text-2xl">
          Alive because it’s sealed.
        </p>
        <p className="font-letter mt-6 max-w-lg text-base leading-relaxed text-[#1C1915]/80">
          Hatch is a living factory seal. A listed stock on the spine. A sealed
          object inside. You watch the nestcam until the first unit is real.
        </p>

        <div className="mt-14 flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
          <Settle show={still || stage >= 1} still={still}>
            <div className="relative bg-[#E7EEF2] p-2">
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 size-11 bg-[#C4A574] [clip-path:polygon(0_0,100%_0,0_100%)]"
              />
              <div className="relative h-48 w-40 overflow-hidden">
                <HatchMark
                  state="pip"
                  className="absolute -top-10 -left-[60px] size-64 text-[#1C1915]"
                />
              </div>
            </div>
          </Settle>

          <Settle show={still || stage >= 2} still={still} className="w-full max-w-[300px]">
            <div className="relative bg-[#F3EBDD] px-4 pt-5 pb-2 ring-1 ring-[#1C1915]/10 [transform:rotate(0.6deg)]">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2.5 left-8 h-3.5 w-16 bg-[#C4A574]/80 [transform:rotate(-6deg)]"
              />
              {RECEIPT.map(([k, v]) => (
                <CatalogRow key={k} k={k} v={v} />
              ))}
            </div>
          </Settle>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/terminal?stock=TTWO&sku=VICE"
            className="inline-flex min-h-11 items-center bg-[#C9A227] px-5 text-sm text-[#1C1915] transition-colors duration-150 ease-out hover:bg-[#C9A227]/85 focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EBDD] focus-visible:outline-none"
          >
            Watch the nestcam
          </Link>
          <Link
            href="#mechanism"
            className="inline-flex min-h-11 items-center text-sm text-[#1C1915] underline-offset-4 transition-colors duration-150 ease-out hover:text-[#C9A227] hover:underline focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EBDD] focus-visible:outline-none"
          >
            Four states
          </Link>
        </div>

        <ul className="mt-14 flex flex-col gap-3 sm:flex-row sm:gap-10">
          {SPINE.map((label) => (
            <li key={label} className="text-[11px]">
              <SpineWord>{label}</SpineWord>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Settle({
  show,
  still,
  className,
  children,
}: {
  show: boolean
  still: boolean
  className?: string
  children: ReactNode
}) {
  if (still) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className, show ? undefined : "pointer-events-none")}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 4 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
