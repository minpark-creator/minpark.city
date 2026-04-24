import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";

type Props = {
  project: Project;
  onOpenImage?: () => void;
  onOpenInfo?: () => void;
  onHover?: () => void;
  dimmed?: boolean;
};

export default function GalleryCard({
  project,
  onOpenImage,
  onOpenInfo,
  onHover,
  dimmed = false,
}: Props) {
  const cover = project.images[0];
  const imageClickable = !!cover && !!onOpenImage;
  return (
    <div className="w-full space-y-2" onMouseEnter={onHover}>
      <button
        type="button"
        disabled={!imageClickable}
        onClick={() => imageClickable && onOpenImage!()}
        className="relative aspect-[3/4] overflow-hidden block w-full p-0"
      >
        <ProjectThumb
          image={cover}
          alt={project.title}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
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
        className="flex items-baseline justify-between gap-2 text-[14px] w-full text-left hover:opacity-70 transition-opacity duration-500 ease-out"
      >
        <span className="font-medium truncate">{project.title}</span>
        {(project.year || project.date) && (
          <span className="text-muted shrink-0 font-normal">
            {project.year ?? new Date(project.date!).getFullYear()}
          </span>
        )}
      </button>
    </div>
  );
}
