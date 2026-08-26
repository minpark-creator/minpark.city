"use client";

import { useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectEntry from "./ProjectEntry";
import ProjectLightbox from "./ProjectLightbox";
import Reveal from "./Reveal";

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
      <section>
        <p className="label eyebrow">Selected work</p>
        <h2 className="display mt-3 text-[26px] sm:text-[40px]">
          Featured Projects
        </h2>

        {selected.length === 0 ? (
          <p className="py-10 text-muted">No featured projects yet.</p>
        ) : (
          selected.map((p, i) => (
            <Reveal key={p._id} delay={i * 60}>
              <ProjectEntry
                project={p}
                index={i}
                onOpenInfo={() => openInfo(p)}
                onOpenImage={(originalIndex) => openImage(p, originalIndex)}
              />
            </Reveal>
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
