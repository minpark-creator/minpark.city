"use client";

import { useState } from "react";
import type { Project } from "../../sanity/queries";
import GalleryCard from "../components/GalleryCard";
import ProjectLightbox from "../components/ProjectLightbox";

type Props = { projects: Project[] };
type Open = {
  project: Project;
  imageStart: number | null;
} | null;

export default function WorkClient({ projects }: Props) {
  const [open, setOpen] = useState<Open>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const openInfo = (project: Project) =>
    setOpen({ project, imageStart: null });
  const openImage = (project: Project, originalIndex: number) =>
    setOpen({ project, imageStart: originalIndex });

  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 pt-6"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {projects.map((p, idx) => {
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
