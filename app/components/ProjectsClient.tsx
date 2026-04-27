"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectEntry from "./ProjectEntry";
import GalleryCard from "./GalleryCard";
import ProjectLightbox from "./ProjectLightbox";

type Props = {
  selected: Project[];
  more: Project[];
};

type Open = {
  project: Project;
  imageStart: number | null;
} | null;

export default function ProjectsClient({ selected, more }: Props) {
  const [open, setOpen] = useState<Open>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const openInfo = (project: Project) =>
    setOpen({ project, imageStart: null });
  const openImage = (project: Project, originalIndex: number) =>
    setOpen({ project, imageStart: originalIndex });

  return (
    <>
      <section className="pt-12 sm:pt-16">
        <div className="flex items-baseline justify-between py-4 border-t border-neutral-200">
          <h2 className="text-[16px]">Selected projects</h2>
          <span className="text-muted text-[14px]">
            {selected.length} projects
          </span>
        </div>
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
      </section>

      <section className="pt-20 sm:pt-28">
        <div className="flex items-baseline justify-between gap-4 py-4 border-t border-neutral-200">
          <h2 className="text-[16px]">View more projects</h2>
          <Link
            href="/work"
            className="text-[14px] text-muted underline-offset-2 hover:underline whitespace-nowrap"
          >
            Click to see all projects →
          </Link>
        </div>
        {more.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 pt-6"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {more.map((p, idx) => {
              const dimmed = hoverIdx !== null && hoverIdx !== idx;
              return (
                <GalleryCard
                  key={p._id}
                  project={p}
                  dimmed={dimmed}
                  onHover={() => setHoverIdx(idx)}
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
