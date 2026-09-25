import Link from "next/link"

export function Close() {
  return (
    <section className="grid-layout pb-16 pt-12 lg:pb-32 lg:pt-16">
      <div className="relative col-span-full grid h-fit grid-cols-4 gap-2 !px-0 lg:col-span-10 lg:col-start-2 lg:grid-cols-10 2xl:col-start-3">
        <div className="with-diagonal-lines pointer-events-none absolute inset-0" />
        <h2 className="t-h3 relative col-span-2 mb-2 text-[var(--g1)]">Launch</h2>
        <p className="t-h1 relative col-span-4 row-start-2 text-[var(--w2)] lg:col-span-8">
          Open a sale for one sealed product.
        </p>
        <div className="t-h1 relative col-span-4 row-start-3 text-[var(--w1)] lg:col-span-8">
          <Link href="/launch">
            <span className="actionable">Open the launchpad</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
