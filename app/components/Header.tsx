"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Essays", href: "/journal" },
  { label: "Observations", href: "/film" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  return (
    <header className="w-full pt-6 pb-4">
      <div className="flex items-center justify-between gap-4">
        {isHome ? (
          <Link
            href="/"
            className="text-[16px] font-medium hover:underline"
          >
            minpark.city
          </Link>
        ) : (
          <Link
            href="/"
            aria-label="Back to home — minpark.city"
            className="inline-flex items-baseline gap-2 text-[16px] font-medium hover:opacity-70 transition-opacity duration-300"
          >
            <span aria-hidden className="text-[18px] leading-none">←</span>
            <span>minpark.city</span>
          </Link>
        )}
        <nav className="flex items-center gap-x-4 sm:gap-x-6 text-[15px]">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:underline ${
                  active ? "text-muted" : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
