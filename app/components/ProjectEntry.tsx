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
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  // Featured (Studio-picked) thumbnails come first; "Show all" expands to the
  // full upload-order list.
  const featured = resolveFeaturedSlots(project, 3);
  const expandedSlots = project.images.map((image, originalIndex) => ({
    image,
    originalIndex,
  }));
  const slots = expanded ? expandedSlots : featured;
  const hiddenCount = Math.max(0, project.images.length - featured.length);

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 py-10 sm:py-14 border-t border-neutral-200 first:border-t-0">
      <div className="col-span-12 md:col-span-3 space-y-3">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-left w-full p-0 hover:opacity-70 transition-opacity duration-500 ease-out"
          aria-label={`Open ${project.title} details`}
        >
          <h3 className="text-[17px] sm:text-[16px] font-medium leading-snug">
            {project.title}
            {project.year && (
              <>
                <br />
                <span className="text-muted font-normal">{project.year}</span>
              </>
            )}
          </h3>
          <div className="text-[14px] text-muted space-y-[2px] mt-3">
            {project.location && <div>{project.location}</div>}
            {project.role && <div>{project.role}</div>}
          </div>
          {project.summary && (
            <p className="text-[14px] leading-[1.55] max-w-[38ch] pt-2 text-foreground">
              {project.summary}
            </p>
          )}
        </button>

        {project.links && project.links.length > 0 && (
          <ul className="pt-4 space-y-1 text-[14px]">
            {project.links.map((link, idx) => (
              <li key={link._key ?? idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline-offset-2 hover:underline"
                >
                  Click to see {link.label}
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
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {slots.map((slot, i) => {
            const dimmed = hovered !== null && hovered !== i;
            return (
              <button
                type="button"
                key={`${slot.originalIndex}-${i}`}
                onMouseEnter={() => setHovered(i)}
                onClick={() => onOpenImage(slot.originalIndex)}
                className="relative aspect-[4/5] overflow-hidden block w-full p-0"
              >
                <ProjectThumb
                  image={slot.image}
                  alt={`${project.title} image ${slot.originalIndex + 1}`}
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

        {hiddenCount > 0 && (
          <div className="pt-4 text-[14px]">
            <button
              type="button"
              onClick={() => setExpanded((x) => !x)}
              className="text-muted underline-offset-2 hover:underline"
            >
              {expanded
                ? "Show fewer"
                : `Show all ${project.images.length} images`}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
