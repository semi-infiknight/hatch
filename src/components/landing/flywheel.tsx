const parts = [
  {
    pct: "50%",
    title: "More of the product",
    body: "Buys more sealed items for the vault.",
    className: "bg-[#E24B3B] text-[#FFF6E8]",
  },
  {
    pct: "30%",
    title: "Company stock",
    body: "Buys the same company’s stock on Solana.",
    className: "bg-[#1F7A78] text-[#F4D7B0]",
  },
  {
    pct: "20%",
    title: "Cash",
    body: "Held for shipping, storage, and redemptions.",
    className: "bg-[#5C3317] text-[#FFF6E8]",
  },
] as const

export function Flywheel() {
  return (
    <section id="fees" className="bg-[#FFF6E8] py-20 text-[#2A1A14]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-letter text-4xl md:text-5xl">Where trading fees go</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#2A1A14]/75">
          Every trade publishes the same split before the sale starts.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {parts.map((part) => (
            <li key={part.pct} className={`rounded-3xl p-6 ${part.className}`}>
              <p className="font-letter text-5xl">{part.pct}</p>
              <h3 className="mt-4 text-xl">{part.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{part.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
