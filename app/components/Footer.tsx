import { getSiteSettings } from "../../sanity/queries";

export default async function Footer() {
  const settings = await getSiteSettings();
  const email = settings.contactEmail?.trim();

  const cvUrl = settings.cvUrl?.trim();

  const links = [
    ...(email
      ? [
          {
            label: "email",
            // Gmail's compose view, pre-addressed. `fs=1` forces the full
            // compose window rather than a reply-style inline box.
            href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              email
            )}`,
          },
        ]
      : []),
    // The CV sits right after email: for a research reader it is the second
    // thing they want, ahead of any social account.
    ...(cvUrl ? [{ label: "cv", href: cvUrl }] : []),
    ...(settings.socialLinks ?? []).map((link) => ({
      label: link.label,
      href: link.url,
    })),
  ];

  if (links.length === 0) return <footer className="mt-24 pb-10" />;

  return (
    <footer className="mt-24 pt-8 pb-10">
      <nav className="flex items-center justify-between gap-x-2 text-[14px] sm:text-[15px] font-nav lowercase tracking-[0.06em] font-light">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {link.label}
            <span aria-hidden className="ml-1 inline-block">
              ↗
            </span>
          </a>
        ))}
      </nav>
    </footer>
  );
}
