"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#live", label: "Live sales" },
  { href: "/#collectibles", label: "Collectibles" },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  if (pathname === "/") return null
  const onLaunchpad = pathname.startsWith("/launch")

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070707]/85 text-[#f5f5f5] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="font-letter text-2xl leading-none tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f5f5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]"
        >
          Hatch
        </Link>
        <nav className="flex items-center gap-2" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden h-10 items-center px-3 text-sm text-[#f5f5f5]/70 hover:text-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f5f5] sm:inline-flex"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/launch"
            aria-current={onLaunchpad ? "page" : undefined}
            className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f5f5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707] ${
              onLaunchpad
                ? "bg-[#f5f5f5] text-[#070707]"
                : "bg-[#f5f5f5] text-[#070707] hover:bg-white"
            }`}
          >
            Launchpad
          </Link>
        </nav>
      </div>
    </header>
  )
}
