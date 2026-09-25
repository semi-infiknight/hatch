import Link from "next/link"

const panels = [
  {
    title: "Price from real sales",
    body: "The vault is priced from a 14-day average of items that actually sold, on eBay, StockX, TCGPlayer, and the company store.",
  },
  {
    title: "Redeem the item",
    body: "Burn tokens and request a sealed item from the vault. Shipping follows after the item is checked out.",
  },
  {
    title: "Deposit an item",
    body: "If you already hold the sealed product, send it in. You receive tokens against it.",
  },
  {
    title: "Reserve stays for later",
    body: "10% of the tokens stay with the vault. They can be sold only while the token price is above the value of the items. The money buys more items.",
  },
] as const

const others = [
  { href: "/launch?stock=NKE&sku=NKE_DROP", label: "Nike" },
  { href: "/launch?stock=HAS&sku=HAS_SET", label: "Hasbro" },
  { href: "/launch?stock=SONY&sku=SONY_HW", label: "Sony" },
  { href: "/launch?stock=DIS&sku=DIS_DROP", label: "Disney" },
] as const

export function Features() {
  return (
    <section className="bg-[#F4D7B0] py-20 text-[#2A1A14]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-letter text-4xl md:text-5xl">On the launchpad</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {panels.map((panel) => (
            <li key={panel.title} className="rounded-3xl bg-[#FFF6E8] p-6">
              <h3 className="font-letter text-2xl">{panel.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#2A1A14]/80">{panel.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ClosingCta() {
  return (
    <section className="bg-[#1F7A78] py-20 text-[#FFF6E8]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-letter text-4xl md:text-6xl">Open the launchpad</h2>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-[#FFF6E8]/85">
          Pick a company, pick one of its sealed products, and launch it. Live sales show up on the home page.
        </p>
        <Link
          href="/launch"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-[#E24B3B] px-6 font-medium text-[#FFF6E8] hover:bg-[#c73d30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF6E8]"
        >
          Open the launchpad
        </Link>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex h-10 items-center rounded-full bg-[#FFF6E8]/15 px-4 text-sm hover:bg-[#FFF6E8]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF6E8]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
