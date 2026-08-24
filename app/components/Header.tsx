"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Essays folded into Publications; its route stays live but unlinked.
// Observations earns its tab — the filming is the part nobody else has.
const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Publications", href: "/publications" },
  { label: "Observations", href: "/film" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="w-full pt-6 pb-4">
      <nav className="flex items-center justify-between gap-x-2 text-[14px] sm:text-[15px] font-nav lowercase tracking-[0.06em] font-light">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:underline ${active ? "text-muted" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
