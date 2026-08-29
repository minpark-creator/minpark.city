import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";
import { getPageIntros, getPublications } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const [publications, intros] = await Promise.all([
    getPublications(),
    getPageIntros(),
  ]);
  const header = intros.publications;

  return (
    <PageShell
      // No eyebrow typed in Studio: fall back to the live count.
      eyebrow={header.eyebrow || `${publications.length} entries`}
      title={header.title}
      intro={header.intro}
      wash="blue"
    >
      <div>
        {publications.length === 0 ? (
          <p className="py-10 text-muted">Nothing here yet.</p>
        ) : (
          <ul>
            {publications.map((pub) => {
              /* An uploaded PDF reads as one more link, first in the row, so
                 a document held in Studio and one hosted elsewhere sit side
                 by side. */
              const links = [
                ...(pub.pdfUrl
                  ? [{ _key: "pdf", label: "Read PDF", url: pub.pdfUrl }]
                  : []),
                ...(pub.links ?? []),
              ];

              return (
                <li
                  key={pub._id}
                  className="grid grid-cols-12 gap-x-6 gap-y-4 py-10 sm:py-14 border-t border-rule first:border-t-0"
                >
                  <Reveal className="col-span-12 md:col-span-3">
                    {pub.kind && <p className="label text-accent-ink">{pub.kind}</p>}
                    {pub.year && <p className="label mt-3 text-muted">{pub.year}</p>}
                  </Reveal>

                  <Reveal className="col-span-12 md:col-span-9" delay={80}>
                    <h2 className="subhead text-[20px] sm:text-[26px] max-w-[40ch]">
                      {pub.title}
                    </h2>

                    <span
                      aria-hidden
                      className="mt-4 block w-14 h-px bg-rule"
                    />

                    {(pub.venue || pub.authors) && (
                      <div className="label mt-5 text-muted space-y-2">
                        {pub.venue && <div>{pub.venue}</div>}
                        {pub.authors && <div className="normal-case tracking-[0.05em]">{pub.authors}</div>}
                      </div>
                    )}

                    {pub.abstract && (
                      <p className="mt-6 text-[15px] sm:text-[16px] leading-[1.7] max-w-[68ch]">
                        {pub.abstract}
                      </p>
                    )}

                    {links.length > 0 && (
                      <ul className="pt-6 flex flex-wrap gap-x-8 gap-y-2">
                        {links.map((link, idx) => (
                          <li key={link._key ?? idx}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="label text-brand hover:text-accent-ink"
                            >
                              {`${link.label} →`.toLowerCase()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
