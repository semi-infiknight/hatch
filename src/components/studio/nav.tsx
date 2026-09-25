"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/", title: "Home" },
  { href: "/launch", title: "Launch" },
  { href: "/terminal", title: "Desk" },
] as const

export function StudioNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <nav className="bs-nav" aria-label="Primary">
      <div className="grid-layout bs-nav-row items-center">
        <Link href="/" className="col-span-1 w-fit lg:col-start-1 lg:col-end-3" aria-label="Hatch, home">
          <span className="bs-logo">Hatch</span>
        </Link>

        <div className="bs-nav-links">
          {links.map((link) => {
            const current = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className="bs-nav-link"
              >
                <span className="actionable-opacity">{link.title}</span>
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          className="bs-menu-btn"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="t-p w-[2.4rem] text-center">{open ? "Close" : "Menu"}</span>
          <span className="relative flex w-5 flex-col items-center justify-center gap-1 pl-1" aria-hidden>
            <span
              className={`h-[1.5px] w-full origin-center bg-[var(--w1)] transition-transform duration-300 ${
                open ? "w-10/12 translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-full origin-center bg-[var(--w1)] transition-transform duration-300 ${
                open ? "w-10/12 -translate-y-[2.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="bs-menu">
          <ul className="flex flex-col gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                    event.preventDefault()
                    go(link.href)
                  }}
                >
                  <span className="actionable">{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  )
}
