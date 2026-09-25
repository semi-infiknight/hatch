"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HatchMark } from "@/components/hatch/mark";

const links = [
  { href: "/", label: "Nest" },
  { href: "/terminal", label: "Nestcam" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#1C1915]/15 bg-[#F3EBDD] text-[#1C1915]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#1C1915]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EBDD] focus-visible:outline-none"
        >
          <HatchMark state="nest" className="size-7" />
          <span className="font-spine text-sm tracking-[0.18em]">HATCH</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Primary">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-8 items-center px-2.5 text-sm tracking-tight focus-visible:ring-2 focus-visible:ring-[#1C1915]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EBDD] focus-visible:outline-none ${
                  active
                    ? "text-[#C9A227]"
                    : "text-[#1C1915]/70 hover:text-[#1C1915]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
