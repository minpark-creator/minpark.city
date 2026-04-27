import type { Project, ProjectImage } from "../../sanity/queries";

/**
 * A featured image slot: the image itself and the original 0-based index
 * into `project.images` so the lightbox can open at the right slide.
 */
export type FeaturedSlot = { image: ProjectImage; originalIndex: number };

/**
 * Resolve the project's featured image slots.
 *
 * `project.featured` is a list of 1-based indices set in Studio
 * (e.g. [6, 3, 5]). When present we use those in order; otherwise we
 * fall back to the first `max` images in upload order.
 */
export function resolveFeaturedSlots(
  project: Project,
  max = 3
): FeaturedSlot[] {
  if (project.featured && project.featured.length > 0) {
    const picks: FeaturedSlot[] = [];
    for (const n of project.featured) {
      const idx = n - 1;
      const image = project.images[idx];
      if (image) picks.push({ image, originalIndex: idx });
    }
    if (picks.length > 0) return picks.slice(0, max);
  }
  return project.images.slice(0, max).map((image, originalIndex) => ({
    image,
    originalIndex,
  }));
}

/** First featured slot (the cover) or `undefined` if there are no images. */
export function resolveCover(project: Project): FeaturedSlot | undefined {
  return resolveFeaturedSlots(project, 1)[0];
}
