import type { Project } from "../../sanity/queries";
import ProjectThumb from "./ProjectThumb";

type Props = {
  project: Project;
  onOpen?: (index: number) => void;
};

export default function ProjectEntry({ project, onOpen }: Props) {
  const placeholderCount = Math.max(0, 3 - project.images.length);
  const slots = [
    ...project.images,
    ...Array.from({ length: placeholderCount }).map(() => undefined),
  ];

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 py-10 sm:py-14 border-t border-neutral-200 first:border-t-0">
      <div className="col-span-12 md:col-span-3 space-y-[2px] text-[14px]">
        {project.location && <div>{project.location}</div>}
        {project.role && <div className="text-muted">{project.role}</div>}
      </div>

      <div className="col-span-12 md:col-span-9">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {slots.map((img, i) => {
            const clickable = !!img && !!onOpen;
            return (
              <button
                type="button"
                key={i}
                disabled={!clickable}
                onClick={() => clickable && onOpen!(i)}
                className="relative aspect-[4/5] overflow-hidden block w-full p-0"
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
