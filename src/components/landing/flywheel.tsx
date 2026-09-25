const bands = [
  {
    label: "MORE OF THE OBJECT",
    height: "h-16 md:h-[4.5rem]",
    surface: "border border-[#C9A227] bg-[#F3EBDD]",
  },
  {
    label: "PARENT STOCK",
    height: "h-12 md:h-14",
    surface: "bg-[#E7EEF2]",
  },
  {
    label: "USDC BUFFER",
    height: "h-9 md:h-11",
    surface: "bg-[#C4A574]",
  },
] as const;

export function Flywheel() {
  return (
    <section
      id="flywheel"
      className="bg-[#F7F2EA] px-4 py-20 md:px-6"
      aria-labelledby="flywheel-title"
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-prose">
          <h2
            id="flywheel-title"
            className="font-serif text-3xl tracking-tight text-[#3C3428] md:text-4xl"
          >
            Warmth.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#6B5E4E] md:text-lg">
            Trading fees keep the seal alive.
          </p>
        </header>

        <div
          className="mt-14 grid grid-cols-[5fr_3fr_2fr] items-end gap-1.5"
          role="img"
          aria-label="Heat on the pack: half more of the object, thirty percent parent stock, twenty percent USDC buffer"
        >
          {bands.map((band) => (
            <div key={band.label} className="flex min-w-0 flex-col justify-end gap-3">
              <div className={`w-full ${band.height} ${band.surface}`} />
              <p className="font-mono text-[10px] leading-snug tracking-[0.12em] text-[#5C5146] md:text-[11px]">
                {band.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-mono text-xs tracking-[0.14em] text-[#5C5146] md:text-sm">
          TRADE → HEAT → OBJECT + EQUITY + CASH
        </p>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-[#3F362C]">
          Half the heat buys more sealed units. Thirty percent buys the parent ticker. Twenty sits for fledge.
        </p>
      </div>
    </section>
  );
}
