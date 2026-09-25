import Link from "next/link";

const panels = [
  {
    title: "Sold-comps tape",
    lines: [
      "14-day TWAP of public sales.",
      "eBay sold, StockX, TCGPlayer, the issuer store.",
    ],
  },
  {
    title: "Pip",
    lines: ["The raise draws a line in the wrap."],
  },
  {
    title: "Hatch",
    lines: ["The first attested unit shows through. Still boxed."],
  },
  {
    title: "Fledge",
    lines: [
      "Burn tokens. Take one sealed unit.",
      "Collectors can also put a unit in and mint.",
    ],
  },
] as const;

const spine = [
  { href: "/terminal?stock=NKE&sku=NKE_DROP", label: "Nike" },
  { href: "/terminal?stock=HAS&sku=HAS_SET", label: "Hasbro" },
  { href: "/terminal?stock=SONY&sku=SONY_HW", label: "Sony" },
  { href: "/terminal?stock=DIS&sku=DIS_DROP", label: "Disney" },
] as const;

const eggshell = "bg-[oklch(0.965_0.014_88)]";
const ink = "text-[oklch(0.26_0.02_62)]";
const inkQuiet = "text-[oklch(0.42_0.018_64)]";
const hairline = "border-[oklch(0.26_0.02_62_/_0.14)]";

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-[oklch(0.62_0.1_75)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.965_0.014_88)] focus-visible:outline-none";

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className={`${eggshell} py-24`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="features-title"
          className={`font-serif text-4xl tracking-tight ${ink} md:text-5xl`}
        >
          Nestcam
        </h2>
        <div className="mt-14 grid gap-px sm:grid-cols-2">
          {panels.map((panel) => (
            <article
              key={panel.title}
              className={`flex flex-col gap-3 border ${hairline} p-8`}
            >
              <h3 className={`font-serif text-2xl tracking-tight ${ink}`}>
                {panel.title}
              </h3>
              <div className={`flex max-w-prose flex-col gap-1 text-sm leading-6 ${inkQuiet}`}>
                {panel.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className={`${eggshell} pb-24`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-prose flex-col items-start gap-5">
          <h2
            id="closing-title"
            className={`font-serif text-4xl tracking-tight ${ink} md:text-5xl`}
          >
            Watch VICE.
          </h2>
          <p className={`text-base leading-7 ${inkQuiet}`}>
            VICE hatched from TTWO.
          </p>
          <Link
            href="/terminal?stock=TTWO&sku=VICE"
            className={`inline-flex h-11 items-center justify-center bg-[oklch(0.74_0.12_78)] px-5 text-sm font-medium text-[oklch(0.22_0.03_60)] motion-safe:transition-colors motion-safe:duration-150 hover:bg-[oklch(0.68_0.12_74)] ${focusRing}`}
          >
            Open the nestcam
          </Link>
        </div>
        <nav aria-label="Other catalogs">
          <ul className={`flex flex-col border-l ${hairline}`}>
            {spine.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`inline-flex h-11 items-center px-4 text-sm ${inkQuiet} motion-safe:transition-colors motion-safe:duration-150 hover:text-[oklch(0.26_0.02_62)] ${focusRing}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
