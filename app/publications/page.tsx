import PageShell from "../components/PageShell";
import { getPublications } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "Publications — minpark" };

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <PageShell>
      <div className="pt-8 sm:pt-12">
        <div className="flex items-baseline justify-between py-4">
          <h1 className="text-[16px]">Published and peer-reviewed work</h1>
          <span className="text-muted text-[14px]">
            {publications.length} entries
          </span>
        </div>

        {publications.length === 0 ? (
          <p className="py-10 text-muted text-[14px]">Nothing here yet.</p>
        ) : (
          <ul className="mt-2">
            {publications.map((pub) => (
              <li
                key={pub._id}
                className="grid grid-cols-12 gap-x-6 gap-y-3 py-8 sm:py-10 border-t border-black/10"
              >
                <div className="col-span-12 md:col-span-3 text-[14px] text-muted space-y-1">
                  {pub.kind && <div>{pub.kind}</div>}
                  {pub.year && <div>{pub.year}</div>}
                </div>

                <div className="col-span-12 md:col-span-9 space-y-3">
                  <h2 className="font-display text-[19px] sm:text-[18px] leading-snug">
                    {pub.title}
                  </h2>

                  {(pub.venue || pub.authors) && (
                    <div className="text-[14px] text-muted space-y-1">
                      {pub.venue && <div>{pub.venue}</div>}
                      {pub.authors && <div>{pub.authors}</div>}
                    </div>
                  )}

                  {pub.abstract && (
                    <p className="text-[15px] leading-[1.55] max-w-[62ch]">
                      {pub.abstract}
                    </p>
                  )}

                  {pub.links && pub.links.length > 0 && (
                    <ul className="pt-1 space-y-1 text-[14px]">
                      {pub.links.map((link, idx) => (
                        <li key={link._key ?? idx}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted underline-offset-2 hover:underline"
                          >
                            {`${link.label} here`.toLowerCase()} →
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
