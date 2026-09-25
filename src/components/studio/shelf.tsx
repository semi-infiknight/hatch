"use client"

import Link from "next/link"
import { useState } from "react"
import { SKUS, getStock } from "@/lib/catalog"

export function Shelf() {
  const [active, setActive] = useState<string | null>(null)
  const label = active
    ? SKUS.find((sku) => sku.id === active)
    : null

  return (
    <section id="collectibles" className="grid-layout !gap-y-4">
      <div className="grid-layout col-span-full !px-0">
        <h2 className="t-h3 col-span-full text-[var(--g1)] lg:col-start-2 2xl:col-start-3">
          On the shelf{" "}
          <span className="ml-px text-[var(--w1)]">
            {label ? `${getStock(label.stockId).name} — ${label.ticker}` : "Still sealed"}
          </span>
        </h2>
      </div>

      <div className="relative col-span-full">
        <div className="shelf-grid grid grid-cols-3 gap-3 lg:grid-cols-6 2xl:grid-cols-8">
          {SKUS.map((sku) => (
              <Link
                key={sku.id}
                href={`/launch?stock=${sku.stockId}&sku=${sku.id}`}
                title={sku.name}
                className="shelf-cell relative aspect-square text-[var(--w1)] after:pointer-events-none after:absolute after:inset-0 after:border after:border-[color-mix(in_srgb,var(--w1)_20%,transparent)] focus-visible:outline-offset-0 md:aspect-[202/110] lg:aspect-[202/110]"
                onMouseEnter={() => setActive(sku.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(sku.id)}
                onBlur={() => setActive(null)}
              >
                <span
                  className={`with-diagonal-lines pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ${
                    active === sku.id ? "opacity-100" : ""
                  }`}
                />
                <span className="with-dots relative grid h-full w-full place-items-center px-2">
                  <span className="t-h4 text-center">{sku.ticker}</span>
                  <span className="sr-only">{sku.name}</span>
                </span>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
