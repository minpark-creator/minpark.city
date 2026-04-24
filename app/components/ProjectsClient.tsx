"use client";

import { useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectEntry from "./ProjectEntry";
import GalleryCard from "./GalleryCard";
import ProjectLightbox from "./ProjectLightbox";

type Props = {
  selected: Project[];
  allByDate: Project[];
};

type Open = { project: Project; index: number } | null;

export default function ProjectsClient({ selected, allByDate }: Props) {
  const [open, setOpen] = useState<Open>(null);

  return (
    <>
      <nav
        aria-label="Section navigation"
        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-5 border-t border-neutral-200 text-[15px] mt-8"
      >
        <a href="#selected" className="hover:underline">
          Selected
        </a>
        <a href="#all" className="hover:underline">
          View all projects by date
        </a>
      </nav>

      <section id="selected" className="scroll-mt-24 pt-2">
        {selected.length === 0 ? (
          <p className="py-10 text-center text-muted text-[14px]">
            No selected projects yet.
          </p>
        ) : (
          selected.map((p) => (
            <ProjectEntry
              key={p._id}
              project={p}
              onImageClick={(idx) => setOpen({ project: p, index: idx })}
            />
          ))
        )}
      </section>

      <section id="all" className="scroll-mt-24 pt-24">
        <div className="flex items-baseline justify-between py-4 border-t border-neutral-200">
          <h2 className="text-[15px]">All projects — by date</h2>
          <span className="text-muted text-[13px]">
            {allByDate.length} projects
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 pt-6">
          {allByDate.map((p) => (
            <GalleryCard
              key={p._id}
              project={p}
              onClick={() => setOpen({ project: p, index: 0 })}
            />
          ))}
        </div>
      </section>

      {open && open.project.images.length > 0 && (
        <ProjectLightbox
          images={open.project.images}
          startIndex={open.index}
          title={open.project.title}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
