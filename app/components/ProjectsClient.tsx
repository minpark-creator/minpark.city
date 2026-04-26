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

type Open = { project: Project; startIndex: number } | null;

export default function ProjectsClient({ selected, more }: Props) {
  const [open, setOpen] = useState<Open>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const openInfo = (project: Project) =>
    setOpen({ project, startIndex: 0 });
  const openImage = (project: Project, imageIndex: number) =>
    setOpen({ project, startIndex: imageIndex + 1 });

  return (
    <>
      <section className="pt-12 sm:pt-20">
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
              onOpenImage={(idx) => openImage(p, idx)}
            />
          ))
        )}
      </section>

      <section className="pt-20 sm:pt-28">
        <div className="flex items-baseline justify-between py-4 border-t border-neutral-200">
          <h2 className="text-[16px]">View more projects</h2>
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
                  onOpenImage={() => openImage(p, 0)}
                  onOpenInfo={() => openInfo(p)}
                />
              );
            })}
          </div>
        )}
        <div className="pt-10 sm:pt-14">
          <Link
            href="/work"
            className="inline-block text-[15px] underline-offset-2 hover:underline"
          >
            Click to see all projects →
          </Link>
        </div>
      </section>

      {open && (
        <ProjectLightbox
          project={open.project}
          startIndex={open.startIndex}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
