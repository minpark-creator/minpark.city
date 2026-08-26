"use client";

import { useState } from "react";
import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";
import { resolveSlotsPadded, slotsByResolution } from "../lib/featured";

type Props = {
  project: Project;
  /** Position in the Featured list, used to vary the layout down the page. */
  index?: number;
  onOpenInfo: () => void;
  onOpenImage: (originalIndex: number) => void;
};

/*
  Arrangements, all of them two or three frames — one photograph on its own
  came out too large and read as a hero rather than a project. Spans are out
  of 12 columns; the widest frame always goes to the sharpest photograph.
*/
const LAYOUTS_2 = [
  [
    { span: "col-span-7", ratio: "aspect-[4/3]" },
    { span: "col-span-5", ratio: "aspect-[4/3]" },
  ],
  [
    { span: "col-span-7", ratio: "aspect-[16/10]" },
    { span: "col-span-5", ratio: "aspect-[3/4]" },
  ],
] as const;

const LAYOUTS_3 = [
  [
    { span: "col-span-6", ratio: "aspect-[3/2]" },
    { span: "col-span-3", ratio: "aspect-[3/4]" },
    { span: "col-span-3", ratio: "aspect-[3/4]" },
  ],
  [
    { span: "col-span-4", ratio: "aspect-[1/1]" },
    { span: "col-span-4", ratio: "aspect-[1/1]" },
    { span: "col-span-4", ratio: "aspect-[1/1]" },
  ],
] as const;

export default function ProjectEntry({
  project,
  index = 0,
  onOpenInfo,
  onOpenImage,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Alternate two and three frames down the page, but never ask for more
  // photographs than the project actually has.
  const want = index % 2 === 0 ? 2 : 3;
  const count = Math.min(want, Math.max(project.images.length, 1));
  const set = count >= 3 ? LAYOUTS_3 : LAYOUTS_2;
  const layout = set[Math.floor(index / 2) % set.length];

  // Sharpest first, so it lands in whichever frame the layout makes largest.
  const slots = slotsByResolution(resolveSlotsPadded(project, count));
  const frames = [...layout]
    .sort((a, b) => Number(b.span.match(/\d+/)![0]) - Number(a.span.match(/\d+/)![0]))
    .slice(0, slots.length);
  const year =
    project.year ??
    (project.date ? String(new Date(project.date).getFullYear()) : undefined);

  // The status line the reference runs above each project title: what kind of
  // thing it is and what the role was, in one glance.
  const status = [project.client, project.role].filter(Boolean).join(" · ");

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 py-12 sm:py-16 border-t border-rule first:border-t-0">
      <div className="col-span-12 md:col-span-4 lg:col-span-3">
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-left w-full p-0 group"
          aria-label={`Open ${project.title} details`}
        >
          {status && <p className="label text-accent-ink">{status}</p>}

          <h3 className="display mt-3 text-[20px] sm:text-[24px] group-hover:opacity-50 transition-opacity">
            {project.title}
          </h3>

          <span
            aria-hidden
            className="mt-4 block w-14 h-px bg-rule group-hover:w-24 transition-[width] duration-500 ease-out"
          />

          {year && (
            <div className="label mt-5 text-muted">{year}</div>
          )}
        </button>

        {project.links && project.links.length > 0 && (
          <ul className="pt-6 space-y-2">
            {project.links.map((link, idx) => (
              <li key={link._key ?? idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-brand hover:text-accent-ink"
                >
                  {`${link.label} →`.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className="col-span-12 md:col-span-8 lg:col-span-9"
        onMouseLeave={() => setHovered(null)}
      >
        {slots.length > 0 && (
          <div className="grid grid-cols-12 gap-3 md:gap-4 items-start">
            {slots.map((slot, i) => {
              // The tint lands on the image being pointed at, so the cursor
              // and the highlight agree with each other.
              const lit = hovered === i;
              const frame = frames[i] ?? frames[frames.length - 1];
              return (
                <button
                  type="button"
                  key={`${slot.originalIndex}-${i}`}
                  onMouseEnter={() => setHovered(i)}
                  onClick={() => onOpenImage(slot.originalIndex)}
                  className={`relative ${frame.span} ${frame.ratio} overflow-hidden rounded-xl block w-full p-0`}
                  aria-label={`Open ${project.title} image ${slot.originalIndex + 1}`}
                >
                  <ProjectThumb
                    image={slot.image}
                    alt={`${project.title} image ${slot.originalIndex + 1}`}
                    sizes="(max-width: 768px) 100vw, 640px"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out"
                    style={{
                      opacity: lit ? 0.38 : 0,
                      backgroundColor: "var(--brand)",
                    }}
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
