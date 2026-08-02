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
  const [primedId, setPrimedId] = useState<string | null>(null);

  const openInfo = (project: Project) =>
    setOpen({ project, imageStart: null });

  // On Work, opening a project always starts on the info slide — the thumbnail
  // and the title lead to the same place. (The home page differs: there a
  // thumbnail click opens that specific image first.)
  const openFromThumb = (project: Project) => {
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;
    if (isTouch && primedId !== project._id) {
      setPrimedId(project._id);
      return;
    }
    openInfo(project);
  };

  return (
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-14 pt-6"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {projects.map((p, idx) => {
          const dimmed = hoverIdx !== null && hoverIdx !== idx;
          return (
            <GalleryCard
              key={p._id}
              project={p}
              dimmed={dimmed}
              primed={primedId === p._id}
              onHover={() => setHoverIdx(idx)}
              onLeave={() => setHoverIdx(null)}
              onOpenImage={() => openFromThumb(p)}
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
