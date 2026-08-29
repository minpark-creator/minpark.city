/**
 * Replaces the Observations video assets with the web-encoded versions and
 * gives each clip a poster frame.
 *
 * The originals are iPhone 4K HLG HEVC in a QuickTime container: ~26 Mbps,
 * 34–90 MB each, and `video/quicktime`, which Firefox often refuses outright.
 * `scripts/../vid/build.sh` re-encodes them to 1600-wide H.264 MP4 and pulls a
 * still; this uploads both and repoints each film document at them.
 *
 * Nothing is deleted. The original assets stay in the dataset, so the previous
 * state is a matter of pointing `videoFile` back at the old `_ref`.
 *
 * Usage:  node scripts/upload-films.mjs <dir-with-out/-and-poster/> [--dry]
 */
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const API_VERSION = "v2024-01-01";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN"
  );
  process.exit(1);
}

const workDir = process.argv[2];
const dryRun = process.argv.includes("--dry");
if (!workDir) {
  console.error("Usage: node scripts/upload-films.mjs <workdir> [--dry]");
  process.exit(1);
}

const base = `https://${projectId}.api.sanity.io/${API_VERSION}`;
const auth = { Authorization: `Bearer ${token}` };

async function query(groq) {
  const res = await fetch(`${base}/data/query/${dataset}?query=${encodeURIComponent(groq)}`, {
    headers: auth,
  });
  if (!res.ok) throw new Error(`query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

async function uploadAsset(kind, filePath, contentType) {
  const body = await readFile(filePath);
  const filename = path.basename(filePath);
  const res = await fetch(
    `${base}/assets/${kind}/${dataset}?filename=${encodeURIComponent(filename)}`,
    { method: "POST", headers: { ...auth, "Content-Type": contentType }, body }
  );
  if (!res.ok) throw new Error(`upload failed: ${res.status} ${await res.text()}`);
  return (await res.json()).document._id;
}

async function mutate(mutations) {
  const res = await fetch(`${base}/data/mutate/${dataset}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`mutate failed: ${res.status} ${await res.text()}`);
  return res.json();
}

/** Studio's own slugify, near enough: it only has to match build.sh. */
const slugify = (s) =>
  [...s.toLowerCase()].map((c) => (/[a-z0-9]/.test(c) ? c : "-")).join("").replace(/^-+|-+$/g, "");

const films = await query(
  `*[_type=="film"]{_id,title,"currentAsset":videoFile.asset->_id}`
);

const outDir = path.join(workDir, "final");
const posterDir = path.join(workDir, "poster");
const encoded = new Set(
  (await readdir(outDir)).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, ""))
);

let done = 0;
for (const film of films) {
  const slug = slugify(film.title);
  if (!encoded.has(slug)) {
    console.log(`SKIP  ${film.title} — no encode named ${slug}.mp4`);
    continue;
  }

  const mp4 = path.join(outDir, `${slug}.mp4`);
  const jpg = path.join(posterDir, `${slug}.jpg`);

  if (dryRun) {
    console.log(`WOULD ${film.title}\n      video  ${mp4}\n      poster ${existsSync(jpg) ? jpg : "(none)"}`);
    continue;
  }

  const videoId = await uploadAsset("files", mp4, "video/mp4");
  const set = {
    videoFile: { _type: "file", asset: { _type: "reference", _ref: videoId } },
  };

  if (existsSync(jpg)) {
    const posterId = await uploadAsset("images", jpg, "image/jpeg");
    set.poster = { _type: "image", asset: { _type: "reference", _ref: posterId } };
  }

  await mutate([{ patch: { id: film._id, set } }]);
  done += 1;
  console.log(`OK    ${film.title}  ->  ${videoId}${set.poster ? " + poster" : ""}`);
}

console.log(`\n${dryRun ? "dry run" : `${done} film(s) updated`}`);
