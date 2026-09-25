import Link from "next/link"

const steps = [
  {
    title: "Pick the company",
    body: "Choose a stock that already trades on Solana.",
    chips: ["Take-Two", "Nike", "Hasbro", "Sony", "Disney"],
    href: "/launch",
  },
  {
    title: "Pick one sealed product",
    body: "One real item from that company. Same item every time, so the vault can price it.",
    chips: ["One item", "Still sealed"],
    href: "/launch",
  },
  {
    title: "Open a sale",
    body: "People buy the token with USDC. The sale ends when it can buy a real number of those items.",
    chips: ["USDC", "Meteora"],
    href: "/launch",
  },
  {
    title: "Fill the vault",
    body: "The raise buys the sealed product and stores it. The token is a claim on what is actually in the vault.",
    chips: ["First unit in", "Stored"],
    href: "/terminal",
  },
  {
    title: "Price from real sales",
    body: "The vault is priced from a 14-day average of items that actually sold.",
    chips: ["eBay sold", "StockX", "TCGPlayer", "Company store"],
    href: "/terminal",
  },
  {
    title: "Redeem or deposit",
    body: "Burn tokens to take a sealed item out. Or send a sealed item in and receive tokens.",
    chips: ["Burn to take one", "Send one in"],
    href: "/terminal",
  },
  {
    title: "Reserve stays",
    body: "10% of the tokens stay with the vault. They can be sold only while the token price is above the value of the items.",
    chips: ["10% stays", "Buys more items"],
    href: "/terminal",
  },
  {
    title: "Fees keep buying",
    body: "Trading fees buy more of the product, more of the company stock, and hold cash for shipping.",
    chips: ["50% product", "30% stock", "20% cash"],
    href: "/#fees",
  },
] as const

export function How() {
  return (
    <section id="how" className="grid-layout">
      <h2 className="t-h3 col-span-full mb-2 text-[var(--g1)] lg:col-start-2 2xl:col-start-3">
        How it works
      </h2>
      <p className="t-h1 col-span-full text-[var(--w2)]">
        Two things sit side by side. The company stock, and one sealed product from that company. Hatch is the sale and the vault between them.
      </p>
      <div id="fees" className="grid-layout relative col-span-full mt-16 !px-0">
        <div className="col-start-1 col-end-11 grid grid-cols-2 gap-x-3 gap-y-8 lg:col-start-2 lg:grid-cols-8 2xl:col-start-3">
          {steps.map((step) => (
            <div key={step.title} className="col-span-1 mt-1.25 flex flex-col gap-y-6 text-[var(--w1)] lg:col-span-2">
              <h3 className="t-h4">
                <Link href={step.href}>
                  <span className="actionable">{step.title}</span>
                </Link>
              </h3>
              <p className="t-h4 -mt-1 text-[var(--w2)]">{step.body}</p>
              <div className="flex flex-wrap gap-1">
                {step.chips.map((chip) => (
                  <p key={chip} className="t-p line-clamp-1 w-fit bg-[var(--g2)] px-1 text-[var(--w1)]">
                    {chip}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
