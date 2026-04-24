import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";

type Props = {
  project: Project;
  onClick?: () => void;
};

export default function GalleryCard({ project, onClick }: Props) {
  const cover = project.images[0];
  const clickable = !!cover && !!onClick;
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onClick!()}
      className={`w-full text-left space-y-2 p-0 ${
        clickable ? "cursor-zoom-in" : "cursor-default"
      }`}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <ProjectThumb image={cover} alt={project.title} />
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
