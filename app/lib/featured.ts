import type { Project, ProjectImage } from "../../sanity/queries";

/**
 * A featured image slot: the image itself and the original 0-based index
 * into `project.images` so the lightbox can open at the right slide.
 */
export type FeaturedSlot = { image: ProjectImage; originalIndex: number };

/**
 * Every image the project's "Featured image numbers" names, in Studio order
 * and with no cap. Numbers pointing past the end of the gallery are dropped,
 * so an empty result means the field is blank or names nothing that exists —
 * the signal to fall back to upload order.
 */
export function explicitFeaturedSlots(project: Project): FeaturedSlot[] {
  const picks: FeaturedSlot[] = [];
  for (const n of project.featured ?? []) {
    const idx = n - 1;
    const image = project.images[idx];
    if (image) picks.push({ image, originalIndex: idx });
  }
  return picks;
}

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
  const picks = explicitFeaturedSlots(project);
  if (picks.length > 0) return picks.slice(0, max);

  return project.images.slice(0, max).map((image, originalIndex) => ({
    image,
    originalIndex,
  }));
}

/**
 * Featured slots topped up to `count` from the project's remaining images.
 *
 * Studio's "Featured image numbers" often names only one or two pictures, but
 * a layout may have three frames to fill. The named picks lead, then the rest
 * of the gallery follows in upload order, so a row is never short.
 */
export function resolveSlotsPadded(
  project: Project,
  count: number
): FeaturedSlot[] {
  const picked = resolveFeaturedSlots(project, count);
  if (picked.length >= count) return picked.slice(0, count);

  const taken = new Set(picked.map((slot) => slot.originalIndex));
  const padded = [...picked];
  project.images.forEach((image, originalIndex) => {
    if (padded.length >= count || taken.has(originalIndex)) return;
    padded.push({ image, originalIndex });
  });
  return padded;
}

/**
 * Pixel count of an image, used to decide which of a project's photographs
 * deserves the larger frame. Sanity gives us the source dimensions, so a
 * scan or a full-frame photo outranks a small crop or a screenshot.
 * Unknown dimensions score 0 and take the smaller slot.
 */
export function imagePixels(image?: ProjectImage): number {
  if (!image?.width || !image?.height) return 0;
  return image.width * image.height;
}

/**
 * Order a project's slots so the highest-resolution image comes first, which
 * is the one the layouts hand the larger frame to.
 */
export function slotsByResolution(slots: FeaturedSlot[]): FeaturedSlot[] {
  return [...slots].sort((a, b) => imagePixels(b.image) - imagePixels(a.image));
}

/** First featured slot (the cover) or `undefined` if there are no images. */
export function resolveCover(project: Project): FeaturedSlot | undefined {
  return resolveFeaturedSlots(project, 1)[0];
}
