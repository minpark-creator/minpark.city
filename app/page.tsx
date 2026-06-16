import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LogoMarquee from "./components/LogoMarquee";
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
  const lead = leadLines.join("\n").trim();

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-16">
      <Header />

      <main className="pb-16">
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
              <p className="font-display mt-6 sm:mt-8 text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.5] max-w-[42ch] sm:max-w-none mx-auto sm:whitespace-nowrap">
                {lead}
              </p>
            )}
            {bulletLines.length > 0 && (
              <ul className="font-display mt-4 sm:mt-5 space-y-1 text-[11px] sm:text-[12px] lg:text-[13px] leading-[1.55] text-muted inline-block text-left max-w-[42ch] sm:max-w-none w-full sm:w-auto">
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

        <LogoMarquee logos={settings.logos} />

        <ProjectsClient selected={selected} />

        <section className="pt-12 sm:pt-16 text-right">
          <Link
            href="/work"
            className="text-[15px] hover:underline"
          >
            Click to see more projects →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
