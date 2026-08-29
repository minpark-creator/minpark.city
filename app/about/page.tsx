import Image from "next/image";
import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";
import { getAboutPage, getPageIntros } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "About" };

export default async function AboutPage() {
  const [about, intros] = await Promise.all([getAboutPage(), getPageIntros()]);
  const header = intros.about;
  const portrait = about.portrait;

  const paragraphs = about.bioText
    ? about.bioText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const hasContact =
    !!(about.contactIntro || about.email || (about.links && about.links.length > 0));

  return (
    <PageShell
      eyebrow={header.eyebrow}
      title={header.title}
      intro={header.intro}
      wash="blue"
    >
      {/*
        Desktop: fixed-width square portrait on the left, everything else in a
        flexible column beside it. Flex rather than the 12-col grid so the gap
        between photo and text is an exact value, not whatever the column
        arithmetic leaves over.
        Mobile: portrait first, then bio + sections + contact stacked.
      */}
      <div className="flex flex-col md:flex-row gap-y-10 md:gap-x-14">
        {portrait?.url && (
          <div className="w-full max-w-[240px] md:max-w-none md:w-[320px] md:shrink-0">
            {/* A hair taller than square (320 × 324) so the photo's baseline
                lands on the last line of the bio. */}
            <div className="relative w-full aspect-square md:aspect-[80/81] overflow-hidden rounded-xl">
              <Image
                src={portrait.url}
                alt={portrait.alt || "Portrait of Min Park"}
                fill
                sizes="(max-width: 768px) 240px, 320px"
                quality={92}
                placeholder={portrait.lqip ? "blur" : "empty"}
                blurDataURL={portrait.lqip ?? undefined}
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="space-y-6 text-[15px] sm:text-[16px] leading-[1.7] max-w-[64ch]">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{about.bioText}</p>
            )}
          </div>

          {about.education && about.education.length > 0 && (
            <Reveal className="mt-16 sm:mt-24">
              <h2 className="subhead text-[22px] sm:text-[30px]">
                Education
              </h2>
              <dl className="mt-8 pl-16 sm:pl-28">
                {about.education.map((item, i) => (
                  <div key={i} className="relative pb-9 last:pb-0">
                    <span
                      aria-hidden
                      className="absolute left-[-28px] sm:left-[-40px] top-0 bottom-0 w-px bg-rule"
                    />
                    <span
                      aria-hidden
                      className="absolute left-[-28px] sm:left-[-40px] top-[6px] w-[7px] h-[7px] -translate-x-1/2 bg-foreground"
                    />
                    <dt className="label text-accent-ink">{item.years}</dt>
                    <dd className="mt-3">
                      <div className="subhead text-[19px] text-brand">
                        {item.institution}
                      </div>
                      {item.degree && (
                        <div className="label mt-2 text-muted">{item.degree}</div>
                      )}
                      {item.focus && (
                        <div className="mt-3 text-[15px] leading-[1.7] max-w-[62ch]">
                          {item.focus}
                        </div>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {about.sections && about.sections.length > 0 && (
            <div className="mt-16 sm:mt-24 space-y-14 sm:space-y-20">
              {about.sections.map((section, i) => (
                <Reveal key={section.title + i}>
                  <h2 className="subhead text-[22px] sm:text-[30px]">
                    {section.title}
                  </h2>
                  <dl className="mt-7">
                    {section.items?.map((item, j) => (
                      <div
                        key={j}
                        className="flex flex-col sm:flex-row gap-x-8 gap-y-1 py-3 border-t border-rule first:border-t-0"
                      >
                        <dt className="label text-accent-ink w-[90px] shrink-0 pt-1">
                          {item.year}
                        </dt>
                        <dd className="text-[15px] sm:text-[16px] leading-[1.7] max-w-[68ch]">
                          {item.text}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ))}
            </div>
          )}

        {/* Contact sits under the bio, inside the same right-hand column. */}
        {hasContact && (
          <section id="contact" className="pt-16 sm:pt-24">
            {about.contactIntro && (
              <p className="text-[16px] leading-[1.75] max-w-[62ch] whitespace-pre-line">
                {about.contactIntro}
              </p>
            )}
            {about.email && (
              <a
                href={`mailto:${about.email}`}
                className="btn btn-ghost mt-8"
              >
                {about.email}
              </a>
            )}
            {about.links && about.links.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
                {about.links.map((link, i) => (
                  <li key={link.label + i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label text-brand hover:text-accent-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        </div>
      </div>
    </PageShell>
  );
}
