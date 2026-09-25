import Link from "next/link"

import { SKUS, getStock, type SkuId } from "@/lib/catalog"
import { formatUsd } from "@/lib/format"

const WRAP: Record<SkuId, string> = {
  VICE: "hologram chip on pale shell",
  NKE_DROP: "tape like a sneaker box",
  HAS_SET: "foil like a pack",
  SONY_HW: "spine like a longbox",
  DIS_DROP: "band like a cassette",
}

const spine =
  "font-spine font-sans text-[11px] uppercase tracking-[0.16em]"

export function Pairs() {
  return (
    <section
      id="reserves"
      aria-labelledby="reserves-title"
      className="bg-[#F7F2EA] text-[#1C1915]"
    >
      <div className="bg-[#C4A574]/25 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <header className="max-w-prose">
            <h2
              id="reserves-title"
              className="font-serif text-4xl tracking-tight md:text-5xl"
            >
              The shelf
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#1C1915]/75 md:text-lg">
              Same silhouette every time. The wrap language changes.
            </p>
          </header>

          <ul className="mt-12 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.24fr)_repeat(4,minmax(0,1fr))] xl:gap-4">
            {SKUS.map((sku) => {
              const stock = getStock(sku.stockId)
              return (
                <li key={sku.id} className="min-w-0">
                  <Link
                    href={`/terminal?stock=${sku.stockId}&sku=${sku.id}`}
                    className="relative flex h-full flex-col overflow-hidden bg-[#F3EBDD] p-4 outline-none ring-1 ring-[#1C1915]/10 focus-visible:ring-2 focus-visible:ring-[#1C1915]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E7DCC8] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-0.5"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 right-0 size-8 bg-[#C9A227]"
                      style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                    />
                    <SealedOvoid state="nest" />
                    <p className={`mt-4 ${spine}`}>
                      {`NEST ${stock.ticker} / EGG ${sku.ticker}`}
                    </p>
                    <h3 className="mt-3 text-base leading-snug font-medium text-pretty">
                      {sku.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#1C1915]/70">
                      {sku.objectLabel}
                    </p>
                    <p className="mt-2 text-sm leading-snug text-[#1C1915]/80">
                      {WRAP[sku.id]}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <dt className="text-[11px] tracking-wide text-[#1C1915]/60">
                          Retail
                        </dt>
                        <dd className="mt-1 font-mono text-sm tabular-nums">
                          {formatUsd(sku.retailUsd)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] tracking-wide text-[#1C1915]/60">
                          14-day TWAP
                        </dt>
                        <dd className="mt-1 font-mono text-sm tabular-nums">
                          {formatUsd(sku.twapUsd)}
                        </dd>
                      </div>
                    </dl>
                    <p className={`mt-auto pt-6 ${spine}`}>WATCH</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

function SealedOvoid({ state }: { state: "nest" }) {
  return (
    <svg
      viewBox="0 0 64 56"
      className="h-12 w-14"
      aria-hidden="true"
      focusable="false"
    >
      {state === "nest" ? (
        <path
          d="M6 40c4 9 14 13 26 13s22-4 26-13"
          fill="#E4D3B5"
          stroke="#1C1915"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      ) : null}
      <ellipse
        cx="32"
        cy="25"
        rx="14"
        ry="18"
        fill="#F7F1E6"
        stroke="#1C1915"
        strokeWidth="1.25"
      />
      <path
        d="M19.5 25h25"
        fill="none"
        stroke="#1C1915"
        strokeWidth="0.9"
        opacity="0.4"
      />
    </svg>
  )
}
