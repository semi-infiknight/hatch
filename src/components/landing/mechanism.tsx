import { Fragment } from "react";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const eggshell = "bg-[oklch(0.965_0.014_88)]";
const ink = "text-[oklch(0.26_0.02_62)]";
const inkQuiet = "text-[oklch(0.42_0.018_64)]";
const gold = "text-[#C9A227]";
const rule = "bg-[oklch(0.26_0.02_62_/_0.14)]";

const STATES = [
  {
    index: "01",
    label: "NEST",
    body: "Still in the wrap, on the parent shelf. The egg-unit sits in packing paper under the ticker.",
  },
  {
    index: "02",
    label: "PIP",
    body: "One hairline in the shrinkwrap. A collector notices the line.",
  },
  {
    index: "03",
    label: "HATCH",
    body: "Wrap off the face. The real SKU is visible, still boxed. First unit in the vault.",
  },
  {
    index: "04",
    label: "FLEDGE",
    body: "The unit leaves the nestcam. The seal is broken on purpose.",
  },
] as const;

const LOCKUP = [
  ["NEST", "TTWO"],
  ["EGG", "VICE"],
] as const;

export function Mechanism() {
  return (
    <section
      id="mechanism"
      aria-labelledby="mechanism-title"
      className={`${eggshell} py-24`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="mechanism-title"
          className={`${newsreader.className} text-4xl font-medium tracking-tight ${ink} md:text-5xl`}
        >
          Four states.
        </h2>
        <p
          className={`${newsreader.className} mt-5 max-w-prose text-lg leading-relaxed ${inkQuiet}`}
        >
          The seal is the promise. You don’t open it yet. You watch it.
        </p>

        <ol className={`mt-14 grid gap-px sm:grid-cols-2 xl:grid-cols-4 ${rule}`}>
          {STATES.map((state) => (
            <li key={state.label} className={`flex flex-col p-6 md:p-8 ${eggshell}`}>
              <p
                className={`font-spine text-sm tabular-nums tracking-[0.16em] ${gold}`}
              >
                {state.index}
              </p>
              <h3
                className={`font-spine mt-4 text-base tracking-[0.2em] uppercase ${ink}`}
              >
                {state.label}
              </h3>
              <p
                className={`${newsreader.className} mt-3 text-[1.0625rem] leading-relaxed ${inkQuiet}`}
              >
                {state.body}
              </p>
            </li>
          ))}
        </ol>

        <div
          aria-label="Parent and child"
          className="mt-8 inline-grid grid-cols-[auto_auto] gap-x-10 gap-y-1"
        >
          {LOCKUP.map(([role, ticker]) => (
            <Fragment key={role}>
              <span
                className={`font-spine text-xs tracking-[0.18em] uppercase ${ink}`}
              >
                {role}
              </span>
              <span
                className={`font-spine text-xs tracking-[0.18em] uppercase ${inkQuiet}`}
              >
                {ticker}
              </span>
            </Fragment>
          ))}
        </div>

        <p
          className={`${newsreader.className} mt-10 max-w-prose text-lg leading-relaxed ${ink}`}
        >
          Curve on Meteora. Distribution through Sunrise. The nestcam is the desk.
        </p>
      </div>
    </section>
  );
}
