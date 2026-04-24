import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";

type Props = {
  project: Project;
  onImageClick?: (index: number) => void;
};

export default function ProjectEntry({ project, onImageClick }: Props) {
  const placeholderCount = Math.max(0, 3 - project.images.length);
  const slots = [
    ...project.images,
    ...Array.from({ length: placeholderCount }).map(() => undefined),
  ];

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 py-14 border-t border-neutral-200 first:border-t-0">
      <div className="col-span-12 md:col-span-3 space-y-3">
        <h3 className="text-[16px] font-medium leading-snug">
          {project.title}
          {project.year && (
            <>
              <br />
              <span className="text-muted font-normal">{project.year}</span>
            </>
          )}
        </h3>
        <div className="text-[14px] text-muted space-y-[2px]">
          {project.client && <div>{project.client}</div>}
          {project.location && <div>{project.location}</div>}
          {project.role && <div>{project.role}</div>}
        </div>
        {project.summary && (
          <p className="text-[14px] leading-[1.55] max-w-[38ch] pt-2">
            {project.summary}
          </p>
        )}
      </div>

      <div className="col-span-12 md:col-span-9">
        <div className="grid grid-cols-3 gap-4">
          {slots.map((img, i) => {
            const clickable = !!img && !!onImageClick;
            return (
              <button
                type="button"
                key={i}
                disabled={!clickable}
                onClick={() => clickable && onImageClick!(i)}
                className={`aspect-[4/5] overflow-hidden block w-full p-0 ${
                  clickable ? "cursor-zoom-in" : "cursor-default"
                }`}
              >
                <ProjectThumb
                  image={img}
                  alt={`${project.title} image ${i + 1}`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
