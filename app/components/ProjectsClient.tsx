"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectEntry from "./ProjectEntry";
import GalleryCard from "./GalleryCard";
import ProjectLightbox from "./ProjectLightbox";

type Props = {
  selected: Project[];
  /** Full pool of non-Selected projects (date-sorted) for the "View more" grid. */
  morePool: Project[];
  /** How many to display from the pool. */
  moreCount: number;
};

type Open = {
  project: Project;
  imageStart: number | null;
} | null;

/**
 * Fisher–Yates shuffle. Returns a new array; doesn't mutate the input.
 */
function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ProjectsClient({
  selected,
  morePool,
  moreCount,
}: Props) {
  const [open, setOpen] = useState<Open>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Server renders the date-sorted slice (stable HTML, no hydration warning).
  // After mount, we replace it with a fresh random pick so each return visit
  // shows a different set.
  const [moreList, setMoreList] = useState<Project[]>(() =>
    morePool.slice(0, moreCount)
  );
  useEffect(() => {
    setMoreList(shuffled(morePool).slice(0, moreCount));
  }, [morePool, moreCount]);

  const openInfo = (project: Project) =>
    setOpen({ project, imageStart: null });
  const openImage = (project: Project, originalIndex: number) =>
    setOpen({ project, imageStart: originalIndex });

  return (
    <>
      <section className="pt-12 sm:pt-16">
        <div className="flex items-baseline justify-between py-4 border-t border-b border-neutral-200">
          <h2 className="text-[16px]">Selected projects</h2>
          <span className="text-muted text-[14px]">
            {selected.length} projects
          </span>
        </div>
        <div className="pt-4 sm:pt-6">
          {selected.length === 0 ? (
            <p className="py-10 text-center text-muted text-[14px]">
              No selected projects yet.
            </p>
          ) : (
            selected.map((p) => (
              <ProjectEntry
                key={p._id}
                project={p}
                onOpenInfo={() => openInfo(p)}
                onOpenImage={(originalIndex) => openImage(p, originalIndex)}
              />
            ))
          )}
        </div>
      </section>

      <section className="pt-20 sm:pt-28">
        <div className="flex items-baseline justify-between gap-4 py-4 border-t border-b border-neutral-200">
          <h2 className="text-[16px]">View more projects</h2>
          <Link
            href="/work"
            className="text-[14px] text-muted underline-offset-2 hover:underline whitespace-nowrap"
          >
            Click to see all →
          </Link>
        </div>
        {moreList.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 pt-10 sm:pt-14"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {moreList.map((p, idx) => {
              const dimmed = hoverIdx !== null && hoverIdx !== idx;
              return (
                <GalleryCard
                  key={p._id}
                  project={p}
                  dimmed={dimmed}
                  onHover={() => setHoverIdx(idx)}
                  onLeave={() => setHoverIdx(null)}
                  onOpenImage={(originalIndex) => openImage(p, originalIndex)}
                  onOpenInfo={() => openInfo(p)}
                />
              );
            })}
          </div>
        )}
      </section>

      {open && (
        <ProjectLightbox
          project={open.project}
          imageStart={open.imageStart}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
