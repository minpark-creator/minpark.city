import Image from "next/image";
import { getSiteSettings } from "../../sanity/queries";

export default async function Footer() {
  const settings = await getSiteSettings();
  const email = settings.contactEmail?.trim();
  const cvUrl = settings.cvUrl?.trim();
  const phone = settings.phone?.trim();

  const links = [
    ...(settings.socialLinks ?? []).map((link) => ({
      label: link.label,
      href: link.url,
    })),
    ...(cvUrl ? [{ label: "Full CV", href: cvUrl }] : []),
  ];

  return (
    /*
      Narrow screens read the footer as a single left-aligned column, in the
      order you would say it out loud: who and where, then how to reach them,
      then the outbound links. From sm up it becomes the columns pushed to the
      right that the desktop layout uses.
    */
    <footer className="mt-20 sm:mt-32 px-4 sm:px-5 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-8 pb-8">
        {/* The mark holds the left edge the columns leave empty. It carries
            its own white ground, so it needs no box of its own. */}
        <Image
          src="/mp-mark.png"
          alt="mp"
          width={750}
          height={750}
          className="w-[72px] sm:w-[96px] h-auto -ml-2 sm:-ml-3"
        />

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-y-6 sm:gap-x-10">
          <address className="not-italic flex flex-col gap-1 sm:min-w-[160px] order-1 sm:order-3">
            {settings.footerName && <span>{settings.footerName}</span>}
            {settings.location && <span>{settings.location}</span>}
            {settings.origin && (
              <span className="text-muted">{settings.origin}</span>
            )}
          </address>

          {/* The email is plain text, not a mailto: it is meant to be read and
              copied, not to hijack a mail client. */}
          <div className="flex flex-col gap-1 sm:min-w-[200px] [overflow-wrap:anywhere] order-2">
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {settings.contactNote && (
              <span className="text-muted">{settings.contactNote}</span>
            )}
          </div>

          <nav className="flex flex-col gap-1 sm:min-w-[120px] order-3 sm:order-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                /* inline-flex keeps the arrow locked to the label; as plain
                   inline content it wrapped onto the line above. */
                className="capitalize w-fit inline-flex items-center gap-1"
              >
                <span aria-hidden>↗</span>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <p className="text-muted">
        ©{new Date().getFullYear()} Min Park. All rights reserved.
      </p>
    </footer>
  );
}
