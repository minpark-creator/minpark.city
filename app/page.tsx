import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroBackdrop from "./components/HeroBackdrop";
import LogoMarquee from "./components/LogoMarquee";
import CollaborationTimeline from "./components/CollaborationTimeline";
import ProjectsClient from "./components/ProjectsClient";
import { getProjects, getSiteSettings } from "../sanity/queries";

export const revalidate = 60;

export default async function Home() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);

  const selected = projects.filter((p) => p.isSelected);

  const introLines = (settings.intro ?? "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd());
  const leadLines: string[] = [];
  const bulletLines: string[] = [];
  for (const line of introLines) {
    const trimmed = line.trimStart();
    if (/^[*•-]\s+/.test(trimmed)) {
      bulletLines.push(trimmed.replace(/^[*•-]\s+/, ""));
    } else if (trimmed.length > 0 || bulletLines.length === 0) {
      leadLines.push(line);
    }
  }
  let lead = leadLines.join("\n").trim();
  // If the Studio intro is a single line, break it into two lines before
  // "working across". Line breaks typed in Studio take precedence.
  if (lead && !lead.includes("\n")) {
    lead = lead.replace(/\s+(working across)/i, "\n$1");
  }
  const hasHeroImages = (settings.heroImages?.length ?? 0) > 0;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-16">
      <Header />

      <main className="pb-16">
        {hasHeroImages ? (
          <section className="relative w-screen mx-[calc(50%-50vw)] bg-neutral-900 aspect-square sm:aspect-[16/9] lg:aspect-[2/1] overflow-hidden">
            <HeroBackdrop images={settings.heroImages!} />
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
              <h1 className="m-0 self-start">
                <Image
                  src="/mp-mark-white.png"
                  alt="minpark.city"
                  width={268}
                  height={267}
                  priority
                  className="w-[110px] sm:w-[140px] lg:w-[170px] h-auto block"
                />
              </h1>
              <div className="self-end text-right text-white">
                {lead && (
                  <p className="font-light whitespace-pre-line text-[11px] sm:text-[15px] lg:text-[17px] leading-[1.5]">
                    {lead}
                  </p>
                )}
                {bulletLines.length > 0 && (
                  <ul className="mt-4 space-y-1 text-[11px] sm:text-[12px] lg:text-[13px] leading-[1.5] text-white/85">
                    {bulletLines.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="pt-10 sm:pt-14 lg:pt-16 pb-4 sm:pb-5">
            <div className="text-center">
              <h1 className="m-0">
                <Image
                  src="/mp-mark.png"
                  alt="minpark.city"
                  width={750}
                  height={750}
                  priority
                  className="mx-auto w-full max-w-[180px] h-auto block"
                />
              </h1>
              {lead && (
                <p className="font-light mt-6 sm:mt-8 text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.5] max-w-[42ch] sm:max-w-none mx-auto whitespace-pre-line">
                  {lead}
                </p>
              )}
              {bulletLines.length > 0 && (
                <ul className="mt-4 sm:mt-5 space-y-1 text-[11px] sm:text-[12px] lg:text-[13px] leading-[1.5] text-muted inline-block text-left max-w-[42ch] sm:max-w-none w-full sm:w-auto">
                  {bulletLines.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="select-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        <LogoMarquee logos={settings.logos} />

        <CollaborationTimeline
          logos={settings.logos}
          heading={settings.logosNote}
        />

        <ProjectsClient selected={selected} />

        <section className="pt-12 sm:pt-16 text-right">
          <Link
            href="/work"
            className="text-[15px] hover:underline"
          >
            more projects here →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
