import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Reveal from "./components/Reveal";
import HeroTrail from "./components/HeroTrail";
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
  const lead = leadLines.join(" ").replace(/\s+/g, " ").trim();

  return (
    <>
      <Header />

      <main>
        {/*
          The statement is the whole first screen: centred, uppercase, set
          large in the display cut with nothing else competing. The photograph
          follows it rather than sitting under it.
        */}
        <HeroTrail images={settings.heroImages ?? []}>
          <section className="px-4 sm:px-5 pt-[132px] sm:pt-[168px] pb-12 sm:pb-16">
            <h1 className="display uppercase mx-auto text-center max-w-[24ch] text-[34px] sm:text-[52px] lg:text-[62px]">
              {lead || "min park is an urban policy researcher."}
            </h1>

            {bulletLines.length > 0 && (
              <ul className="mt-10 mx-auto max-w-[60ch] text-center space-y-1 text-muted">
                {bulletLines.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-2.5">
              <Link href="/publications" className="btn">
                Publications
                <span aria-hidden>↘</span>
              </Link>
              <Link href="/work" className="btn">
                All projects
                <span aria-hidden>↘</span>
              </Link>
              <Link href="/about" className="btn">
                About
                <span aria-hidden>↘</span>
              </Link>
            </div>
          </section>
        </HeroTrail>

        {/* Collaborations: the logo strip, then what each one actually was. */}
        <section>
          <div className="px-4 sm:px-5 pt-2 sm:pt-4 pb-4">
            <LogoMarquee logos={settings.logos} />
            <Reveal>
              <CollaborationTimeline
                logos={settings.logos}
                heading={settings.logosNote}
              />
            </Reveal>
          </div>
        </section>

        {/* Featured Projects. */}
        <section className="pt-16 sm:pt-24">
          <div>
            <div className="px-4 sm:px-5 pt-4 pb-8">
              <ProjectsClient selected={selected} />

              <Reveal className="pt-14 sm:pt-20">
                <Link href="/work" className="btn">
                  All projects
                  <span aria-hidden>↘</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
