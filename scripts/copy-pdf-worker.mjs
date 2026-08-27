/**
 * Copies pdf.js's worker into `public/vendor/` so the Studio can load it from
 * a stable URL (`/vendor/pdf.worker.min.mjs`).
 *
 * pdf.js insists on a real worker file — the usual bundler tricks
 * (`new URL(..., import.meta.url)`) are fragile across Turbopack/webpack and
 * across dev/build, and getting them wrong silently drops the rasteriser onto
 * the main thread. A copied file is boring and always works. It's ignored by
 * git and regenerated on every `npm install`.
 */
import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

async function main() {
  let src;
  try {
    src = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");
  } catch {
    // Not an error worth failing `npm install` over — the Studio action tells
    // the user what's missing if the file never lands.
    console.warn("[pdf-worker] pdfjs-dist not installed, skipping copy");
    return;
  }
  const destDir = path.join(process.cwd(), "public", "vendor");
  await mkdir(destDir, { recursive: true });
  const dest = path.join(destDir, "pdf.worker.min.mjs");
  await copyFile(src, dest);
  console.log(`[pdf-worker] copied to ${path.relative(process.cwd(), dest)}`);
}

main().catch((err) => {
  console.warn("[pdf-worker] copy failed:", err.message);
});
