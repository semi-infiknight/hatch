"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#collectibles", label: "Collectibles" },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const onLaunchpad = pathname.startsWith("/terminal") || pathname.startsWith("/launch")

  return (
    <header className="sticky top-0 z-20 border-b border-[#3D2418]/20 bg-[#5C3317] text-[#FFF6E8]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="font-letter text-2xl leading-none tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF6E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C3317]"
        >
          Hatch
        </Link>
        <nav className="flex items-center gap-2" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden h-10 items-center px-3 text-sm text-[#FFF6E8]/80 hover:text-[#FFF6E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF6E8] sm:inline-flex"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/terminal?stock=TTWO&sku=VICE"
            aria-current={onLaunchpad ? "page" : undefined}
            className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF6E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C3317] ${
              onLaunchpad
                ? "bg-[#FFF6E8] text-[#5C3317]"
                : "bg-[#E24B3B] text-[#FFF6E8] hover:bg-[#c73d30]"
            }`}
          >
            Launchpad
          </Link>
        </nav>
      </div>
    </header>
  )
}
