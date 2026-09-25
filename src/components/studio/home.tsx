import { SKUS } from "@/lib/catalog"
import { Close } from "@/components/studio/close"
import { Featured } from "@/components/studio/featured"
import { StudioFooter } from "@/components/studio/footer"
import { How } from "@/components/studio/how"
import { LiveSales } from "@/components/studio/live"
import { StudioNav } from "@/components/studio/nav"
import { Shelf } from "@/components/studio/shelf"

const flagship = ["VICE", "NKE_DROP", "HAS_SET", "SONY_HW", "DIS_DROP"] as const

export function HomeLanding() {
  const items = flagship.map((id) => SKUS.find((sku) => sku.id === id)).filter((sku) => sku != null)

  return (
    <>
      <StudioNav />
      <main className="bs-main">
        <section className="grid-layout" aria-labelledby="hero-heading">
          <article className="col-span-full flex flex-col gap-4 text-[var(--w1)] lg:col-span-11">
            <h1 id="hero-heading" className="t-h0 text-pretty">
              Sealed until it’s alive.
            </h1>
            <div className="w-full lg:w-[60%]">
              <p className="t-h4 text-balance text-[var(--w1)]">
                Alive because it’s sealed. A token for one product, next to the company that makes it.
              </p>
            </div>
          </article>
        </section>
        <LiveSales />
        <Shelf />
        <Featured items={items} />
        <How />
        <Close />
      </main>
      <StudioFooter />
    </>
  )
}
