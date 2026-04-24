import Link from "next/link";

const leftNav = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const rightNav = [
  { label: "Journal", href: "/journal" },
  { label: "Film", href: "/film" },
];

export default function Header() {
  return (
    <header className="w-full pt-6 pb-4 text-[15px]">
      <div className="relative flex items-center justify-between">
        <nav className="flex items-center gap-x-5">
          {leftNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 hover:underline"
        >
          minpark.city
        </Link>
        <nav className="flex items-center gap-x-5">
          {rightNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
