"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Essays folded into Publications; its route stays live but unlinked.
// Observations earns its tab — the filming is the part nobody else has.
const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/work" },
  { label: "Publications", href: "/publications" },
  { label: "Observations", href: "/film" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  // Route changes close the panel; otherwise it hangs open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background">
      <div className="px-4 sm:px-5 py-3.5">
        <div className="flex items-start justify-between gap-6">
          {/* Wordmark and sections read as one cluster on the left. */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* The wordmark is always the full name; it turns red only when
                home is the current page. */}
            <Link
              href="/"
              className="font-display tracking-[-0.02em]"
              style={{ color: isActive("/") ? "var(--red)" : undefined }}
              aria-current={isActive("/") ? "page" : undefined}
            >
              MINPARK.CITY
            </Link>

            <nav className="hidden md:flex items-center gap-x-5">
              {nav.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap"
                  style={{ color: isActive(item.href) ? "var(--red)" : undefined }}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* One control, parked mid-bar, the way the reference does. */}
          <Link
            href="/about#contact"
            className="btn hidden lg:inline-flex min-w-[280px] justify-between"
          >
            Get in touch
            <span aria-hidden>↘</span>
          </Link>

          <p className="hidden sm:block text-muted max-w-[24ch] leading-[1.4]">
            Urban policy researcher, working between London and Seoul.
          </p>

          <button
            type="button"
            className="md:hidden flex items-center gap-2"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
            <span aria-hidden className="relative block w-4 h-[7px]">
              <span
                className="absolute inset-x-0 top-0 h-px bg-foreground transition-transform duration-300"
                style={{ transform: open ? "translateY(3px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-foreground transition-transform duration-300"
                style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className="md:hidden overflow-hidden transition-[max-height] duration-400 ease-in-out"
        style={{ maxHeight: open ? `${nav.length * 40 + 20}px` : "0px" }}
      >
        <nav className="px-4 pb-4 flex flex-col">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2"
              style={{ color: isActive(item.href) ? "var(--red)" : undefined }}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
