import Link from "next/link"
import { getStock, type Sku } from "@/lib/catalog"
import { formatUsd } from "@/lib/format"

const plates: Record<string, string> = {
  copper: "#8C4A32",
  ink: "#1C1915",
  kraft: "#C4A574",
  gold: "#C9A227",
  pip: "#D6B7A0",
  wrap: "#E7EEF2",
  red: "#8E2F2A",
  cobalt: "#243E73",
  teal: "#1F7A78",
  black: "#141210",
  platinum: "#8E8E8E",
}

function Arrow() {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" className="size-6" aria-hidden>
      <path d="m11.1075 14.2752 4.2763-4.29004-4.2625-4.2625h1.9112l4.2625 4.27625-4.2763 4.27629h-1.9112ZM2.5 10.8102V9.17391h13.8188v1.63629H2.5Z" />
    </svg>
  )
}

export function Featured({ items }: { items: Sku[] }) {
  return (
    <div id="nest" className="grid-layout !gap-y-0">
      {items.map((sku, index) => {
        const stock = getStock(sku.stockId)
        const href = `/launch?stock=${sku.stockId}&sku=${sku.id}`
        const plate = plates[sku.accent] ?? "#1C1915"
        const ink = sku.accent === "kraft" || sku.accent === "gold" || sku.accent === "pip" || sku.accent === "wrap" || sku.accent === "platinum"
          ? "#1C1915"
          : "#FFF6E8"

        return (
          <div
            key={sku.id}
            className={`col-span-full lg:sticky ${
              index === 0 ? "lg:top-0" : index === items.length - 1 ? "top-[6.8rem] lg:top-[9.3rem]" : "top-[6.7rem] lg:top-[9.2rem]"
            }`}
            style={{ zIndex: index + 1 }}
          >
            {index === 0 ? (
              <h2 className="t-h1 col-span-full bg-[var(--k)] pb-6 pt-12 text-[var(--w2)] lg:pt-14">
                In the nest
              </h2>
            ) : null}
            <article className="grid-layout col-span-full border-t border-[color-mix(in_srgb,var(--w1)_30%,transparent)] bg-[var(--k)] !px-0 py-4">
              <div className="relative col-span-full after:pointer-events-none after:absolute after:inset-0 after:border after:border-[color-mix(in_srgb,var(--w1)_20%,transparent)] lg:col-span-7">
                <div className="plate aspect-[16/10]" style={{ background: plate, color: ink }}>
                  <span>{sku.ticker}</span>
                </div>
              </div>
              <div className="col-span-full flex flex-col justify-between gap-y-2 md:col-span-3 md:pr-12 lg:pr-2">
                <Link href={href} className="t-h2 text-[var(--w1)] md:hidden">
                  <span className="actionable">{sku.name}</span>
                </Link>
                <p className="t-h4 text-[var(--w2)]">{sku.summary}</p>
                <p className="t-h4 hidden flex-col text-[var(--w1)] lg:!flex">
                  <span>{stock.name}</span>
                  <span>{sku.objectLabel}</span>
                  <span>Recent sales {formatUsd(sku.twapUsd, { digits: 0 })}</span>
                </p>
              </div>
              <Link
                href={href}
                className="group t-h2 hidden h-max min-w-0 text-[var(--w1)] md:col-span-1 md:block lg:col-span-2 lg:col-start-11"
              >
                <span className="actionable-wrap">{sku.name}</span>{" "}
                <span className="inline-block translate-y-0.5 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                  <Arrow />
                </span>
              </Link>
            </article>
          </div>
        )
      })}
    </div>
  )
}
