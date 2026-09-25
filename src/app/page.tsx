import { ClosingCta, Features } from "@/components/landing/features";
import { Flywheel } from "@/components/landing/flywheel";
import { Hero } from "@/components/landing/hero";
import { Mechanism } from "@/components/landing/mechanism";
import { Pairs } from "@/components/landing/pairs";

export default function Home() {
  return (
    <>
      <main className="flex-1 bg-[#F3EBDD]">
        <Hero />
        <Mechanism />
        <Pairs />
        <Flywheel />
        <Features />
        <ClosingCta />
      </main>
      <footer className="bg-[#F3EBDD]">
        <p className="mx-auto max-w-7xl px-4 py-8 font-serif text-[#1C1915]/70 md:px-6">
          Sealed until it’s alive.
        </p>
      </footer>
    </>
  );
}
