"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Journal", href: "/journal" },
  { label: "Film", href: "/film" },
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
            aria-label="Back to home"
            className="inline-flex items-center text-[18px] hover:opacity-70"
          >
            <span aria-hidden>←</span>
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
                  active ? "text-neutral-400" : ""
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
