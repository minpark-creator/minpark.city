"use client";

import { useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectEntry from "./ProjectEntry";
import ProjectLightbox from "./ProjectLightbox";

type Props = {
  selected: Project[];
};

type Open = {
  project: Project;
  imageStart: number | null;
} | null;

export default function ProjectsClient({ selected }: Props) {
  const [open, setOpen] = useState<Open>(null);

  const openInfo = (project: Project) =>
    setOpen({ project, imageStart: null });
  const openImage = (project: Project, originalIndex: number) =>
    setOpen({ project, imageStart: originalIndex });

  return (
    <>
      <section className="pt-12 sm:pt-16">
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
