import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";
import { resolveCover } from "../lib/featured";

type Props = {
  project: Project;
  onOpenImage?: (originalIndex: number) => void;
  onOpenInfo?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  dimmed?: boolean;
  primed?: boolean;
  /** Headline projects take two columns and a wider frame. */
  large?: boolean;
};

export default function GalleryCard({
  project,
  onOpenImage,
  onOpenInfo,
  onHover,
  onLeave,
  dimmed = false,
  primed = false,
  large = false,
}: Props) {
  const coverSlot = resolveCover(project);
  const cover = coverSlot?.image;
  const imageClickable = !!cover && !!onOpenImage;
  return (
    <div
      className={`group/card w-full space-y-2 ${
        large ? "col-span-2" : ""
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        disabled={!imageClickable}
        onClick={() =>
          imageClickable && onOpenImage!(coverSlot?.originalIndex ?? 0)
        }
        className={`group relative ${large ? "aspect-[16/9]" : "aspect-[3/2]"} overflow-hidden rounded-xl block w-full p-0`}
      >
        <ProjectThumb
          image={cover}
          alt={project.title}
          sizes={large ? "(max-width: 768px) 100vw, 780px" : "(max-width: 768px) 50vw, 380px"}
          className={`${
            primed ? "" : "grayscale"
          } group-hover:grayscale-0 transition-[filter] duration-500 ease-out`}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-500 ease-out"
          style={{ opacity: dimmed ? 0.72 : 0 }}
        />
      </button>
      <button
        type="button"
        onClick={onOpenInfo}
        className="block text-[14px] w-full text-left hover:opacity-80 transition-opacity duration-300 ease-out"
      >
        <span className="subhead text-[15px] line-clamp-2 leading-snug block transition-colors duration-300 ease-out group-hover/card:opacity-50">
          {project.title}
        </span>
        {(project.year || project.date) && (
          <span className="text-muted block mt-1">
            {project.year ?? new Date(project.date!).getFullYear()}
          </span>
        )}
      </button>
    </div>
  );
}
