import Image from "next/image";
import PageShell from "../components/PageShell";
import { getAboutPage } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "About — minpark" };

export default async function AboutPage() {
  const about = await getAboutPage();
  const portrait = about.portrait;

  const paragraphs = about.bioText
    ? about.bioText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const hasContact =
    !!(about.contactIntro || about.email || (about.links && about.links.length > 0));

  return (
    <PageShell>
      {/*
        Desktop: fixed-width square portrait on the left, everything else in a
        flexible column beside it. Flex rather than the 12-col grid so the gap
        between photo and text is an exact value, not whatever the column
        arithmetic leaves over.
        Mobile: portrait first, then bio + sections + contact stacked.
      */}
      <div className="flex flex-col md:flex-row gap-y-10 md:gap-x-12 pt-8 sm:pt-14">
        {portrait?.url && (
          <div className="w-full max-w-[240px] md:max-w-none md:w-[320px] md:shrink-0">
            {/* A hair taller than square (320 × 324) so the photo's baseline
                lands on the last line of the bio. */}
            <div className="relative w-full aspect-square md:aspect-[80/81] overflow-hidden">
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
          <div className="space-y-5 text-[14px] sm:text-[15px] leading-[1.55] max-w-[58ch] md:max-w-none">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{about.bioText}</p>
            )}
          </div>

          {about.education && about.education.length > 0 && (
            <div className="mt-14 sm:mt-20 grid grid-cols-12 gap-x-4 sm:gap-x-8 gap-y-3">
              <div className="col-span-12 md:col-span-3">
                <h2 className="text-[16px]">Education</h2>
              </div>
              <dl className="col-span-12 md:col-span-9 text-[15px] leading-[1.55]">
                {about.education.map((item, i) => (
                  <div key={i} className="flex gap-x-4 sm:gap-x-6 py-2">
                    <dt className="w-[80px] sm:w-[100px] shrink-0 text-muted text-[13px] sm:text-[14px]">
                      {item.years}
                    </dt>
                    <dd>
                      <div>{item.institution}</div>
                      {item.degree && (
                        <div className="text-muted text-[14px] mt-1">
                          {item.degree}
                        </div>
                      )}
                      {item.focus && (
                        <div className="text-muted text-[14px] mt-1">
                          {item.focus}
                        </div>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {about.sections && about.sections.length > 0 && (
            <div className="mt-14 sm:mt-20 space-y-10 sm:space-y-14">
              {about.sections.map((section, i) => (
                <div
                  key={section.title + i}
                  className="grid grid-cols-12 gap-x-4 sm:gap-x-8 gap-y-3"
                >
                  <div className="col-span-12 md:col-span-3">
                    <h2 className="text-[16px]">{section.title}</h2>
                  </div>
                  <dl className="col-span-12 md:col-span-9 text-[15px] leading-[1.55]">
                    {section.items?.map((item, j) => (
                      <div key={j} className="flex gap-x-4 sm:gap-x-6 py-1">
                        <dt className="w-[80px] sm:w-[100px] shrink-0 text-muted text-[13px] sm:text-[14px]">
                          {item.year}
                        </dt>
                        <dd>{item.text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

        {/* Contact sits under the bio, inside the same right-hand column. */}
        {hasContact && (
          <section id="contact" className="pt-10 sm:pt-16">
            {about.contactIntro && (
              <p className="text-[14px] sm:text-[15px] leading-[1.55] max-w-[56ch] whitespace-pre-line">
                {about.contactIntro}
              </p>
            )}
            {about.email && (
              <a
                href={`mailto:${about.email}`}
                className="font-display block mt-8 sm:mt-10 tracking-[-0.01em] text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] leading-[1.15] [overflow-wrap:anywhere] hover:opacity-70 transition-opacity duration-500 ease-out no-underline hover:no-underline"
              >
                {about.email}
              </a>
            )}
            {about.links && about.links.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                {about.links.map((link, i) => (
                  <li key={link.label + i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted underline-offset-2 hover:underline"
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
