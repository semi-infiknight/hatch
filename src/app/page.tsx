import { ClosingCta, Features } from "@/components/landing/features"
import { Flywheel } from "@/components/landing/flywheel"
import { Hero } from "@/components/landing/hero"
import { Launched } from "@/components/landing/launched"
import { Mechanism } from "@/components/landing/mechanism"
import { Pairs } from "@/components/landing/pairs"

export default function Home() {
  return (
    <>
      <main className="flex-1 bg-[#F4D7B0]">
        <Hero />
        <Launched />
        <Mechanism />
        <Pairs />
        <Flywheel />
        <Features />
        <ClosingCta />
      </main>
      <footer className="bg-[#5C3317] text-[#FFF6E8]">
        <p className="mx-auto max-w-6xl px-6 py-8 text-sm">
          Hatch. A token for a sealed product, next to the company stock.
        </p>
      </footer>
    </>
  )
}
