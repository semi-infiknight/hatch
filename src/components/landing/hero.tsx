"use client"

import { useState } from "react"
import Link from "next/link"
import { HeroScene, heroPieceCopy, type HeroPiece } from "@/components/landing/hero-scene"

export function Hero() {
  const [active, setActive] = useState<HeroPiece | null>(null)
  const piece = heroPieceCopy(active)

  return (
    <section
      className="relative h-[calc(100svh-4rem)] min-h-[560px] overflow-hidden bg-[#070707] text-[#f5f5f5]"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <HeroScene active={active} onHover={setActive} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/75 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/30" />

      <div className="relative flex h-full max-w-6xl flex-col justify-end px-6 pt-10 pb-10 md:justify-center md:pb-16">
        <p className="font-spine text-sm tracking-[0.18em] text-[#E24B3B] uppercase">
          Collectible launchpad
        </p>
        <h1
          id="hero-heading"
          className="font-letter mt-3 text-6xl leading-[0.9] text-[#f5f5f5] md:text-8xl"
        >
          Hatch
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-[#f5f5f5]/80">
          Hatch launches a token for one sealed product. The money from the sale
          buys that product into a vault. The token is your claim on those items.
        </p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-[#f5f5f5]/55">
          Start with a company stock that already trades on Solana, then choose
          one real item that company sells.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/launch"
            className="pointer-events-auto inline-flex h-12 items-center rounded-full bg-[#f5f5f5] px-6 text-base font-medium text-[#070707] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f5f5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]"
          >
            Open the launchpad
          </Link>
          <Link
            href="/terminal"
            className="pointer-events-auto inline-flex h-12 items-center rounded-full border border-white/25 px-5 text-base text-[#f5f5f5] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f5f5]"
          >
            Open a desk
          </Link>
        </div>
        <p className="mt-8 font-spine text-xs tracking-[0.16em] text-[#f5f5f5]/50 uppercase">
          {piece.kicker}
          <span className="ml-3 text-[#f5f5f5]">{piece.title}</span>
        </p>
      </div>
    </section>
  )
}
