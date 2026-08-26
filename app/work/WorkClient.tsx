"use client";

import { useMemo, useState } from "react";
import type { Project } from "../../sanity/queries";
import GalleryCard from "../components/GalleryCard";
import ProjectLightbox from "../components/ProjectLightbox";
import { TRACKS } from "../lib/tracks";

type Props = { projects: Project[] };
type Open = {
  project: Project;
  imageStart: number | null;
} | null;

export default function WorkClient({ projects }: Props) {
  const [open, setOpen] = useState<Open>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [primedId, setPrimedId] = useState<string | null>(null);
  // One filter at a time, "All" to start, exactly as the reference behaves.
  const [filter, setFilter] = useState<string>("all");

  const openInfo = (project: Project) =>
    setOpen({ project, imageStart: null });

  // On Projects, opening always starts on the info slide — the thumbnail and
  // the title lead to the same place. (The home page differs: there a
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

  // Only offer a chip for a track that has something behind it.
  const filters = useMemo(() => {
    const used = TRACKS.filter((t) =>
      projects.some((p) => (p.track ?? "") === t.key)
    ).map((t) => ({ key: t.key as string, label: t.label as string }));
    const untracked = projects.some(
      (p) => !TRACKS.some((t) => t.key === (p.track ?? ""))
    );
    return [
      { key: "all", label: "All" },
      ...used,
      ...(untracked ? [{ key: "other", label: "Other" }] : []),
    ];
  }, [projects]);

  const shown = useMemo(() => {
    if (filter === "all") return projects;
    if (filter === "other") {
      return projects.filter(
        (p) => !TRACKS.some((t) => t.key === (p.track ?? ""))
      );
    }
    return projects.filter((p) => (p.track ?? "") === filter);
  }, [projects, filter]);

  return (
    <>
      <div
        role="group"
        aria-label="Filter projects"
        className="flex flex-wrap gap-2 pt-2 pb-10"
      >
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`chip ${filter === f.key ? "chip-active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/*
        Importance sets the size, the way the reference does it: anything
        marked Featured in Studio takes two columns and a wider frame, the
        rest take one. With a filter applied the same rule still holds, so a
        group's own headline projects lead it.
      */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12"
        onMouseLeave={() => setHoverId(null)}
      >
        {shown.map((p) => (
          <GalleryCard
            key={p._id}
            project={p}
            large={!!p.isSelected}
            dimmed={hoverId !== null && hoverId !== p._id}
            primed={primedId === p._id}
            onHover={() => setHoverId(p._id)}
            onLeave={() => setHoverId(null)}
            onOpenImage={() => openFromThumb(p)}
            onOpenInfo={() => openInfo(p)}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="py-10 text-muted">Nothing in this group yet.</p>
      )}

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
