import Link from "next/link";

const nav = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Journal", href: "/journal" },
  { label: "Film", href: "/film" },
];

export default function Header() {
  return (
    <header className="w-full pt-6 pb-4">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-ui text-[16px] font-medium hover:underline"
        >
          minpark.city
        </Link>
        <nav className="font-ui flex items-center gap-x-4 sm:gap-x-6 text-[15px]">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
