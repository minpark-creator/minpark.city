"use client";

import { useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";
import { resolveFeaturedSlots } from "../lib/featured";

type Props = {
  project: Project;
  onOpenInfo: () => void;
  onOpenImage: (originalIndex: number) => void;
};

export default function ProjectEntry({
  project,
  onOpenInfo,
  onOpenImage,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const slots = resolveFeaturedSlots(project, 2);
  const year =
    project.year ??
    (project.date ? String(new Date(project.date).getFullYear()) : undefined);

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 py-10 sm:py-14">
      <div className="col-span-12 md:col-span-3 space-y-3">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-left w-full p-0 hover:opacity-70 transition-opacity duration-500 ease-out"
          aria-label={`Open ${project.title} details`}
        >
          <h3 className="font-display text-[19px] sm:text-[18px] leading-snug">
            {project.title}
          </h3>
          {project.role && (
            <div className="text-[14px] text-muted mt-3">{project.role}</div>
          )}
          {project.client && (
            <div className="text-[14px] text-muted mt-1">{project.client}</div>
          )}
          {year && <div className="text-[14px] text-muted mt-1">{year}</div>}
        </button>

        {project.links && project.links.length > 0 && (
          <ul className="pt-5 space-y-1 text-[14px]">
            {project.links.map((link, idx) => (
              <li key={link._key ?? idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline-offset-2 hover:underline"
                >
                  {`${link.label} here`.toLowerCase()} →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className="col-span-12 md:col-span-9"
        onMouseLeave={() => setHovered(null)}
      >
        {slots.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {slots.map((slot, i) => {
              const dimmed = hovered !== null && hovered !== i;
              return (
                <button
                  type="button"
                  key={`${slot.originalIndex}-${i}`}
                  onMouseEnter={() => setHovered(i)}
                  onClick={() => onOpenImage(slot.originalIndex)}
                  className="relative aspect-[4/3] overflow-hidden block w-full p-0"
                  aria-label={`Open ${project.title} image ${slot.originalIndex + 1}`}
                >
                  <ProjectThumb
                    image={slot.image}
                    alt={`${project.title} image ${slot.originalIndex + 1}`}
                    sizes="(max-width: 768px) 50vw, 420px"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-500 ease-out"
                    style={{ opacity: dimmed ? 0.72 : 0 }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
