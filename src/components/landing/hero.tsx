import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-[#F4D7B0] text-[#2A1A14]" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:py-20">
        <div>
          <p className="font-spine text-sm tracking-[0.18em] text-[#E24B3B] uppercase">
            Collectible launchpad
          </p>
          <h1
            id="hero-heading"
            className="font-letter mt-3 text-5xl leading-[0.95] text-[#2A1A14] md:text-7xl"
          >
            Hatch
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#2A1A14]/85">
            Hatch launches a token for one sealed product. The money from the
            sale buys that product into a vault. The token is your claim on
            those items.
          </p>
          <p className="mt-3 max-w-md text-base leading-relaxed text-[#2A1A14]/70">
            You start with a company stock that already trades on Solana, then
            choose one real item that company sells. The first one is a sealed
            Vice City Collection box from Take-Two.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/terminal?stock=TTWO&sku=VICE"
              className="inline-flex h-12 items-center rounded-full bg-[#E24B3B] px-6 text-base font-medium text-[#FFF6E8] hover:bg-[#c73d30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E24B3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4D7B0]"
            >
              Open the launchpad
            </Link>
            <Link
              href="#how"
              className="inline-flex h-12 items-center rounded-full px-4 text-base text-[#2A1A14] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A1A14]"
            >
              How it works
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border-[10px] border-[#5C3317] shadow-[0_24px_0_#5C3317]">
          <div className="grid sm:grid-cols-2">
            <div className="flex min-h-64 flex-col justify-between bg-[#1F7A78] p-6 text-[#F4D7B0]">
              <p className="font-spine text-xs tracking-[0.16em] uppercase">Company stock</p>
              <div>
                <p className="font-letter text-5xl leading-none">TTWO</p>
                <p className="mt-3 text-sm leading-relaxed">
                  Take-Two already trades on Solana. This side is the company.
                </p>
              </div>
            </div>
            <div className="flex min-h-64 flex-col justify-between bg-[#E24B3B] p-6 text-[#FFF6E8]">
              <p className="font-spine text-xs tracking-[0.16em] uppercase">Sealed product</p>
              <div className="my-4 h-24 w-full rounded-md bg-[#FFF6E8]/15 ring-1 ring-[#FFF6E8]/40">
                <div className="flex h-full items-end justify-between px-3 pb-3">
                  <span className="font-letter text-2xl">VICE</span>
                  <span className="rounded-sm bg-[#F4D7B0] px-2 py-1 font-mono text-[11px] text-[#5C3317]">
                    Sealed box
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                A Vice City Collection box, still sealed. This side is the item in the vault.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
