import Link from "next/link"
import { SKUS, getStock } from "@/lib/catalog"
import { formatUsd } from "@/lib/format"

const wraps: Record<string, string> = {
  VICE: "Collector box",
  NKE_DROP: "Sealed pair",
  HAS_SET: "Booster box",
  SONY_HW: "Sealed console",
  DIS_DROP: "Sealed statue",
}

const tones = ["bg-[#1F7A78]", "bg-[#E24B3B]", "bg-[#5C3317]", "bg-[#C46B2D]", "bg-[#2A1A14]"]

export function Pairs() {
  return (
    <section id="collectibles" className="bg-[#F4D7B0] py-20 text-[#2A1A14]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-letter text-4xl md:text-5xl">Collectibles</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#2A1A14]/75">
          Each card is one company and one sealed product. Open any of them in the launchpad. After a sale is live, it appears at the top of the home page.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKUS.map((sku, index) => {
            const stock = getStock(sku.stockId)
            return (
              <li key={sku.id}>
                <Link
                  href={`/launch?stock=${sku.stockId}&sku=${sku.id}`}
                  className="flex h-full flex-col justify-between rounded-3xl border-[6px] border-[#5C3317] bg-[#FFF6E8] p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E24B3B] focus-visible:ring-offset-2"
                >
                  <div>
                    <div className={`mb-5 flex h-28 items-end rounded-2xl px-4 pb-4 text-[#FFF6E8] ${tones[index]}`}>
                      <div>
                        <p className="font-spine text-[11px] tracking-[0.16em] uppercase">
                          {stock.name}
                        </p>
                        <p className="font-letter text-3xl leading-none">{sku.ticker}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#2A1A14]/60">{wraps[sku.id] ?? sku.objectLabel}</p>
                    <h3 className="font-letter mt-1 text-2xl leading-tight">{sku.name}</h3>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-3">
                    <p className="font-mono text-sm tabular-nums">
                      Store {formatUsd(sku.retailUsd)}
                      <span className="mt-1 block text-[#2A1A14]/60">
                        Recent sales {formatUsd(sku.twapUsd)}
                      </span>
                    </p>
                    <span className="rounded-full bg-[#E24B3B] px-3 py-1.5 text-sm text-[#FFF6E8]">
                      Launch
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
