"use client";

import { useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectEntry from "./ProjectEntry";
import ProjectLightbox from "./ProjectLightbox";

type Props = {
  selected: Project[];
};

/**
 * Research reads first, design last. A project with no track set falls into
 * "Other" so nothing silently disappears from the page.
 */
const TRACKS = [
  { key: "research", label: "Research" },
  { key: "practice", label: "Practice" },
  { key: "design", label: "Design" },
  { key: "", label: "Other" },
] as const;

type Open = {
  project: Project;
  imageStart: number | null;
} | null;

export default function ProjectsClient({ selected }: Props) {
  const [open, setOpen] = useState<Open>(null);

  // Only group once at least one project has been given a track in Studio —
  // until then the list renders flat, exactly as before.
  const anyTracked = selected.some((p) => p.track);
  const grouped = anyTracked
    ? TRACKS.map(({ key, label }) => ({
        label,
        items: selected.filter((p) => (p.track ?? "") === key),
      })).filter((g) => g.items.length > 0)
    : [];

  const openInfo = (project: Project) =>
    setOpen({ project, imageStart: null });
  const openImage = (project: Project, originalIndex: number) =>
    setOpen({ project, imageStart: originalIndex });

  return (
    <>
      <section className="pt-12 sm:pt-16">
        <h2 className="text-[16px] pb-2">Featured projects</h2>

        {selected.length === 0 ? (
          <p className="py-10 text-center text-muted text-[14px]">
            No featured projects yet.
          </p>
        ) : grouped.length > 0 ? (
          grouped.map(({ label, items }) => (
            <div key={label}>
              <h3 className="text-[13px] text-muted lowercase tracking-[0.06em] pt-8 sm:pt-10 border-t border-black/10">
                {label}
              </h3>
              {items.map((p) => (
                <ProjectEntry
                  key={p._id}
                  project={p}
                  onOpenInfo={() => openInfo(p)}
                  onOpenImage={(originalIndex) => openImage(p, originalIndex)}
                />
              ))}
            </div>
          ))
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
