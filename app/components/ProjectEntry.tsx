"use client";

import { useState } from "react";
import type { Project, ProjectImage } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";
import {
  explicitFeaturedSlots,
  resolveSlotsPadded,
  slotsByResolution,
} from "../lib/featured";

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

type Frame = {
  span: string;
  /** House ratio to crop to, or omitted to keep the image's own proportions. */
  ratio?: string;
};

/**
 * The image's own aspect ratio, clamped so a panorama or a tall poster can't
 * run away with the page. Only the single-image layout uses it: that frame is
 * full width with no neighbour to line up against, so it can show the whole
 * photograph instead of a crop.
 */
function naturalAspect(image?: ProjectImage): number {
  const w = image?.width;
  const h = image?.height;
  if (!w || !h) return 16 / 10;
  return Math.min(Math.max(w / h, 3 / 4), 21 / 9);
}

/**
 * Frames for a given number of photographs. Two and three keep the hand-made
 * arrangements, alternating down the page; one runs full width; four-or-more
 * get an even grid, since a set that size has no "largest" frame to earn.
 */
function layoutFor(count: number, index: number): readonly Frame[] {
  // One photograph takes the whole image column, out to the right edge, and
  // keeps its own proportions. There is no second frame to agree with, so
  // cropping it to a house ratio only threw away picture.
  if (count <= 1) return [{ span: "col-span-12" }];
  if (count === 2) return LAYOUTS_2[Math.floor(index / 2) % LAYOUTS_2.length];
  if (count === 3) return LAYOUTS_3[Math.floor(index / 2) % LAYOUTS_3.length];
  if (count === 4)
    return Array.from({ length: 4 }, () => ({
      span: "col-span-6",
      ratio: "aspect-[4/3]",
    }));
  return Array.from({ length: count }, () => ({
    span: "col-span-4",
    ratio: "aspect-[1/1]",
  }));
}

export default function ProjectEntry({
  project,
  index = 0,
  onOpenInfo,
  onOpenImage,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Studio's "Featured image numbers" is taken literally: exactly those
  // images, in exactly that order, however many there are.
  const picked = explicitFeaturedSlots(project);

  // With nothing named, alternate two and three frames down the page, but
  // never ask for more photographs than the project actually has.
  const want = index % 2 === 0 ? 2 : 3;
  const fallbackCount = Math.min(want, Math.max(project.images.length, 1));
  const slots = picked.length
    ? picked
    // Sharpest first, so it lands in whichever frame the layout makes largest.
    : slotsByResolution(resolveSlotsPadded(project, fallbackCount));

  const layout = layoutFor(slots.length, index);
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

          <h3 className="subhead mt-3 text-[20px] sm:text-[24px] group-hover:opacity-50 transition-opacity">
            {project.title}
          </h3>

          <span
            aria-hidden
            className="mt-4 block w-14 h-px bg-rule group-hover:w-24 transition-[width] duration-500 ease-out"
          />

          {/*
            One line saying what the project is. It sits between the title and
            the year so the eye picks it up on the way past — without it the
            column is a title and a date, and the reader has to open the
            lightbox to learn what they are looking at.
          */}
          {project.summary && (
            <p className="mt-4 text-[14px] leading-[1.45] text-muted">
              {project.summary}
            </p>
          )}
        </button>

        {/*
          What was actually done, in the shape of the Projects filter chips.
          A list rather than a sentence, so it reads as a record attached to
          this project instead of a claim about the person. It sits outside
          the button on purpose: a list is not phrasing content, and nothing
          here is meant to be clicked.
        */}
        {project.methods && project.methods.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.methods.map((method, i) => (
              <li key={method + i}>
                <span className="chip chip-static">{method}</span>
              </li>
            ))}
          </ul>
        )}

        {year && <div className="label mt-5 text-muted">{year}</div>}
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
                  className={`relative ${frame.span} ${frame.ratio ?? ""} overflow-hidden rounded-xl block w-full p-0`}
                  style={
                    frame.ratio
                      ? undefined
                      : { aspectRatio: naturalAspect(slot.image) }
                  }
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
