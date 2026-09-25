import Link from "next/link"

const links = [
  { href: "/", title: "Home" },
  { href: "/launch", title: "Launch" },
  { href: "/terminal", title: "Desk" },
  { href: "/#how", title: "How it works" },
  { href: "/#collectibles", title: "Collectibles" },
  { href: "/#live", title: "Live sales" },
] as const

export function StudioFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bs-footer">
      <div className="grid-layout">
        <p className="bs-wordmark col-span-full">Hatch</p>
      </div>
      <div className="grid-layout items-end gap-y-10 py-4 lg:gap-y-2 lg:py-0">
        <ul className="col-span-full flex flex-col gap-y-2 border-b border-[color-mix(in_srgb,var(--w1)_30%,transparent)] pb-4 lg:col-start-7 lg:col-end-10 lg:border-none lg:pb-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="t-h1 w-fit text-[var(--w1)] lg:!text-[length:2.375rem] lg:!leading-[2.25rem] lg:!tracking-[-0.04em]">
                <span className="actionable">{link.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="t-p col-span-full text-[var(--g1)] lg:col-start-10 lg:col-end-13 lg:text-right">
          © Hatch {year}
        </p>
      </div>
    </footer>
  )
}
