"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Essays", href: "/journal" },
  { label: "Observations", href: "/film" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="w-full pt-6 pb-4">
      <nav className="flex items-center justify-center gap-x-8 sm:gap-x-12 text-[15px]">
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
