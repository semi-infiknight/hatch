import Link from "next/link"
import { ClosingCta, Features } from "@/components/landing/features"
import { Flywheel } from "@/components/landing/flywheel"
import { Hero } from "@/components/landing/hero"
import { Launched } from "@/components/landing/launched"
import { Mechanism } from "@/components/landing/mechanism"
import { Pairs } from "@/components/landing/pairs"

export default function Home() {
  return (
    <>
      <main className="flex-1 bg-[#070707]">
        <Hero />
        <Launched />
        <Mechanism />
        <Pairs />
        <Flywheel />
        <Features />
        <ClosingCta />
      </main>
      <footer className="border-t border-white/10 bg-[#070707] text-[#f5f5f5]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-letter text-3xl">Hatch</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#f5f5f5]/60">
              A token for a sealed product, next to the company stock.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer">
            <Link className="text-[#f5f5f5]/70 hover:text-[#f5f5f5]" href="/#how">
              How it works
            </Link>
            <Link className="text-[#f5f5f5]/70 hover:text-[#f5f5f5]" href="/#live">
              Live sales
            </Link>
            <Link className="text-[#f5f5f5]/70 hover:text-[#f5f5f5]" href="/#collectibles">
              Collectibles
            </Link>
            <Link className="text-[#f5f5f5]/70 hover:text-[#f5f5f5]" href="/#fees">
              Fees
            </Link>
            <Link className="text-[#f5f5f5]/70 hover:text-[#f5f5f5]" href="/launch">
              Launchpad
            </Link>
            <Link className="text-[#f5f5f5]/70 hover:text-[#f5f5f5]" href="/terminal">
              Desk
            </Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
