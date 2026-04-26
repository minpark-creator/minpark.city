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

  return (
    <PageShell>
      <div className="grid grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12 pt-8 sm:pt-14">
        {portrait?.url && (
          <div className="col-span-12 md:col-span-4 md:col-start-2">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={portrait.url}
                alt={portrait.alt || "Portrait of Min Park"}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                placeholder={portrait.lqip ? "blur" : "empty"}
                blurDataURL={portrait.lqip ?? undefined}
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div
          className={`col-span-12 ${
            portrait?.url
              ? "md:col-span-6"
              : "md:col-span-8 md:col-start-2"
          }`}
        >
          <div className="space-y-5 text-[16px] sm:text-[17px] leading-[1.7] max-w-[58ch]">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{about.bioText}</p>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-10 md:col-start-2 space-y-10 sm:space-y-14">
          {about.sections?.map((section, i) => (
            <div
              key={section.title + i}
              className="grid grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-4 pt-8 sm:pt-10 border-t border-neutral-200"
            >
              <div className="col-span-12 md:col-span-3">
                <h2 className="text-[16px] font-medium">
                  {section.title}
                </h2>
              </div>
              <dl className="col-span-12 md:col-span-8 text-[15px] leading-[1.6]">
                {section.items?.map((item, j) => (
                  <div
                    key={j}
                    className="flex gap-x-4 sm:gap-x-6 py-2 border-b border-neutral-100 last:border-b-0"
                  >
                    <dt className="w-[90px] sm:w-[120px] shrink-0 text-muted text-[13px] sm:text-[14px]">
                      {item.year}
                    </dt>
                    <dd>{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {(about.contactIntro || about.email || (about.links && about.links.length > 0)) && (
          <section
            id="contact"
            className="col-span-12 md:col-span-10 md:col-start-2 pt-12 sm:pt-16 mt-4 border-t border-neutral-200"
          >
            <h2 className="text-[16px] font-medium mb-6">Contact</h2>
            {about.contactIntro && (
              <p className="text-[16px] sm:text-[17px] leading-[1.7] max-w-[56ch] whitespace-pre-line">
                {about.contactIntro}
              </p>
            )}
            {about.email && (
              <a
                href={`mailto:${about.email}`}
                className="block mt-8 sm:mt-10 tracking-[-0.01em] text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px] leading-[1.1] hover:opacity-70 transition-opacity duration-500 ease-out no-underline hover:no-underline"
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
    </PageShell>
  );
}
