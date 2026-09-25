const steps = [
  {
    n: "01",
    title: "Pick the company",
    body: "Choose a stock that already trades on Solana. Take-Two, Nike, Hasbro, Sony, or Disney.",
  },
  {
    n: "02",
    title: "Pick one sealed product",
    body: "One real item from that company. A box, a pair, a console. Same item every time, so the vault can price it.",
  },
  {
    n: "03",
    title: "Open a sale",
    body: "People buy the token with USDC. The sale ends when it raises enough to buy a real number of those items.",
  },
  {
    n: "04",
    title: "Fill the vault",
    body: "The raise buys the sealed product and stores it. The token is a claim on what is actually in the vault.",
  },
  {
    n: "05",
    title: "Redeem or deposit",
    body: "Burn tokens to take a sealed item out. Or send a sealed item in and receive tokens.",
  },
  {
    n: "06",
    title: "Fees keep buying",
    body: "Trading fees buy more of the product, more of the company stock, and hold cash for shipping.",
  },
] as const

export function Mechanism() {
  return (
    <section id="how" className="bg-[#FFF6E8] py-20 text-[#2A1A14]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-letter text-4xl md:text-5xl">How it works</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#2A1A14]/75">
          Two things sit side by side. The company stock, and one sealed product
          from that company. Hatch is the sale and the vault between them.
        </p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="flex flex-col rounded-3xl border border-[#5C3317]/15 bg-[#F4D7B0] p-6"
            >
              <span className="font-spine text-sm tracking-[0.16em] text-[#E24B3B]">
                {step.n}
              </span>
              <h3 className="font-letter mt-3 text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#2A1A14]/80">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-[#2A1A14]/70">
          The sale uses a Meteora curve. After it fills, the token trades through Sunrise on Phantom, Jupiter, and Solflare.
        </p>
      </div>
    </section>
  )
}
