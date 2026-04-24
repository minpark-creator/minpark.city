export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "production"
);

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const hasSanity = projectId.length > 0;

function assertValue<T>(v: T | undefined, fallback: T): T {
  return v ?? fallback;
}
