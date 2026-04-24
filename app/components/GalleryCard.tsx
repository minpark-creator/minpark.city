import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";

type Props = {
  project: Project;
  onClick?: () => void;
  onHover?: () => void;
  dimmed?: boolean;
};

export default function GalleryCard({
  project,
  onClick,
  onHover,
  dimmed = false,
}: Props) {
  const cover = project.images[0];
  const clickable = !!cover && !!onClick;
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onClick!()}
      onMouseEnter={onHover}
      className="w-full text-left space-y-2 p-0"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <ProjectThumb
          image={cover}
          alt={project.title}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200"
          style={{ opacity: dimmed ? 0.72 : 0 }}
        />
      </div>
      <div className="flex items-baseline justify-between gap-2 text-[14px]">
        <span className="font-medium truncate">{project.title}</span>
        {(project.year || project.date) && (
          <span className="text-muted shrink-0 font-normal">
            {project.year ?? new Date(project.date!).getFullYear()}
          </span>
        )}
      </div>
    </button>
  );
}
