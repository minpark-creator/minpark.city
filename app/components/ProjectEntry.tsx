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

  const slots = resolveFeaturedSlots(project, 3);
  const allSlots = project.images.map((image, originalIndex) => ({
    image,
    originalIndex,
  }));

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 py-10 sm:py-14">
      <div className="col-span-12 md:col-span-3 space-y-3">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-left w-full p-0 hover:opacity-70 transition-opacity duration-500 ease-out"
          aria-label={`Open ${project.title} details`}
        >
          <h3 className="font-display text-[18px] sm:text-[17px] font-medium leading-snug">
            {project.title}
          </h3>
          {project.role && (
            <div className="text-[14px] text-muted mt-3">{project.role}</div>
          )}
          {project.summary && (
            <p className="text-[14px] leading-[1.55] max-w-[38ch] pt-5 text-foreground">
              {project.summary}
            </p>
          )}
        </button>

        {project.links && project.links.length > 0 && (
          <ul className="pt-10 space-y-1 text-[14px]">
            {project.links.map((link, idx) => (
              <li key={link._key ?? idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline-offset-2 hover:underline"
                >
                  Click to see {link.label} →
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
        {/* Mobile: all images, horizontal scroll, non-clickable. */}
        <div
          className="md:hidden flex gap-3 overflow-x-auto -mx-6 px-6 snap-x snap-mandatory"
          aria-label={`${project.title} images — scroll horizontally`}
        >
          {allSlots.map((slot) => (
            <div
              key={`m-${slot.originalIndex}`}
              className="relative aspect-[4/5] overflow-hidden block w-[70vw] shrink-0 snap-start"
            >
              <ProjectThumb
                image={slot.image}
                alt={`${project.title} image ${slot.originalIndex + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Desktop: featured 3-up grid, clickable. */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
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
      </div>
    </article>
  );
}
