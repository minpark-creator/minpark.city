import Header from "./components/Header";
import Footer from "./components/Footer";
import CyclingTitle from "./components/CyclingTitle";
import LogoMarquee from "./components/LogoMarquee";
import HeroVideo from "./components/HeroVideo";
import ProjectsClient from "./components/ProjectsClient";
import { getProjects, getSiteSettings } from "../sanity/queries";

export const revalidate = 60;

export default async function Home() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);

  const byDateDesc = (a: { date?: string }, b: { date?: string }) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    return bd - ad;
  };
  const selected = projects.filter((p) => p.isSelected);
  const moreLimit = settings.viewMoreCount ?? 4;
  const morePool = projects
    .filter((p) => !p.isSelected)
    .sort(byDateDesc);

  const prefix = settings.title.endsWith(".")
    ? settings.title
    : `${settings.title}.`;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-16">
      <Header />

      <main className="pb-16">
        <section className="pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-12">
          <div className="max-w-[720px] text-left">
            <CyclingTitle
              prefix={prefix}
              words={settings.words ?? []}
            />
            <p className="mt-6 sm:mt-8 text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.5] whitespace-pre-line">
              {settings.intro}
            </p>
          </div>
        </section>

        <HeroVideo
          url={settings.heroVideoUrl}
          fileUrl={settings.heroVideoFileUrl}
          poster={settings.heroPoster}
        />

        <LogoMarquee logos={settings.logos} />

        <ProjectsClient
          selected={selected}
          morePool={morePool}
          moreCount={moreLimit}
        />
      </main>

      <Footer />
    </div>
  );
}
