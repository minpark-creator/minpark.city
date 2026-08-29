import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../components/PageShell";
import { getProjects } from "../../../sanity/queries";
import type { Project } from "../../../sanity/queries";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

async function findProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

/**
 * Every project is prerendered at build time. The list is small and changes
 * rarely, so there is no reason to make the first visitor pay for the fetch.
 */
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) return { title: "Project" };

  // The description is the summary if there is one, otherwise the opening of
  // the body — either way trimmed to something a share card can hold.
  const raw = project.summary || project.body || "";
  const description = raw.replace(/\s+/g, " ").trim().slice(0, 200);
  const meta = [project.year, project.role, project.location]
    .filter(Boolean)
    .join(" · ");
  const cover = project.images.find((img) => img.url)?.url;

  return {
    title: project.title,
    description: description || meta,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.title,
      description: description || meta,
      url: `/work/${slug}`,
      type: "article",
      images: cover
        ? [{ url: cover, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: description || meta,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) notFound();

  const meta = [project.year, project.role, project.location]
    .filter(Boolean)
    .join(" · ");

  const paragraphs = project.body
    ? project.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const withUrl = project.images.filter((img) => img.url);

  return (
    <PageShell>
      <article className="pt-2">
        <Link href="/work" className="label text-muted hover:text-ink">
          ← All projects
        </Link>

        {/*
          The title runs the whole measure. Prose cannot — a line of body text
          across 1440px is 130 characters and unreadable — so the width is
          filled by putting something else in it: the facts go in a column on
          the left, the argument in a column on the right, and the images run
          past both to the edge of the window.
        */}
        <header className="mt-8">
          <h1 className="display text-[32px] sm:text-[56px] lg:text-[68px] max-w-[20ch]">
            {project.title}
          </h1>
        </header>

        <div className="mt-10 sm:mt-14 grid grid-cols-12 gap-x-6 gap-y-8 border-t border-rule pt-8">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            {meta && <p className="text-muted text-[14px]">{meta}</p>}

            {(project.client || project.partners) && (
              <dl className="mt-6 space-y-3 text-[14px]">
                {project.client && (
                  <div>
                    <dt className="label text-muted">As part of</dt>
                    <dd className="mt-1">{project.client}</dd>
                  </div>
                )}
                {project.partners && (
                  <div>
                    <dt className="label text-muted">In partnership with</dt>
                    <dd className="mt-1">{project.partners}</dd>
                  </div>
                )}
              </dl>
            )}

            {project.links && project.links.length > 0 && (
              <ul className="mt-8 space-y-2">
                {project.links.map((l, i) => (
                  <li key={l._key ?? i}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="label text-brand hover:text-accent-ink"
                    >
                      {`${l.label} →`.toLowerCase()}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/*
            The text alone has to hold the top of the page. One column of prose
            cannot fill 1440px — the line would run past 130 characters — so on
            a wide screen it breaks into two, which fills the measure and keeps
            each line at a readable length. Below `lg` it stays a single column.
          */}
          {paragraphs.length > 0 && (
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <div className="text-[17px] leading-[1.6] lg:columns-2 lg:gap-12">
                {paragraphs.map((p, i) => (
                  <p key={i} className="mb-5 break-inside-avoid">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/*
          The lightbox pages through these one at a time; the page stacks them,
          so a link to a project shows the whole thing at once — and so a
          crawler sees the images at all.
        */}
        {/* Full-bleed: cancels the shell's page padding so the pictures reach
            both edges of the window. */}
        {withUrl.length > 0 && (
          <div className="mt-16 sm:mt-24 space-y-4 sm:space-y-6 -mx-4 sm:-mx-5">
            {withUrl.map((img, i) =>
              img.url ? (
                <figure key={img._key ?? i} className="relative">
                  <Image
                    src={img.url}
                    alt={img.alt || `${project.title} — ${i + 1}`}
                    width={img.width ?? 1600}
                    height={img.height ?? 1000}
                    sizes="100vw"
                    quality={95}
                    placeholder={img.lqip ? "blur" : "empty"}
                    blurDataURL={img.lqip ?? undefined}
                    className="w-full h-auto"
                  />
                  {img.alt && (
                    <figcaption className="mt-2 px-4 sm:px-5 text-[13px] text-muted">
                      {img.alt}
                    </figcaption>
                  )}
                </figure>
              ) : null
            )}
          </div>
        )}
      </article>
    </PageShell>
  );
}
