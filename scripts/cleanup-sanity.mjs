/**
 * One-off dataset tidy-up, run by hand:
 *
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/cleanup-sanity.mjs
 *
 * Three jobs, all of them things the schema alone cannot do:
 *
 *  1. Drop the fields left over from the old design (title, words,
 *     heroVideoFile on Site Settings, journal on Page Intros). These are what
 *     Studio flags as "Unknown fields found".
 *  2. Delete every Journal / Essays document, now that the type is gone.
 *  3. Copy the timeline copy that currently lives in sanity/fallback.ts into
 *     the Site Settings logos, so the years and descriptions show up in Studio
 *     as editable text instead of empty fields. Logos that already carry a
 *     description in Studio are left alone.
 *
 * Get a token with Editor rights at
 * https://www.sanity.io/manage/project/dxqmuym2/api  →  Tokens.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
// Node 24 strips the types on the way in, so the seed copy has exactly one
// home: sanity/fallback.ts. Nothing is duplicated here.
import { fallbackSettings } from "../sanity/fallback.ts";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error(
    "Set SANITY_API_WRITE_TOKEN first:\n" +
      "  SANITY_API_WRITE_TOKEN=sk... node scripts/cleanup-sanity.mjs"
  );
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((p) => p.trim()))
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// 1 — the leftovers from the old design.
await client
  .patch("siteSettings")
  .unset(["title", "words", "heroVideoFile"])
  .commit({ autoGenerateArrayKeys: false });
console.log("✓ Site Settings: removed title, words, heroVideoFile");

const intros = await client.fetch(`*[_type == "pageIntros"][0]._id`);
if (intros) {
  await client.patch(intros).unset(["journal"]).commit();
  console.log("✓ Page Intros: removed the Essays header");
}

// 2 — the Journal documents themselves.
const journal = await client.fetch(`*[_type == "journalEntry"]._id`);
if (journal.length) {
  const tx = journal.reduce((t, id) => t.delete(id), client.transaction());
  await tx.commit();
}
console.log(`✓ Journal: deleted ${journal.length} document(s)`);

// 3 — put the timeline copy where it can be edited.
// Studio spells a few of these differently from the seed; same mapping the
// site itself uses in sanity/queries.ts.
const ALIASES = {
  uff: "urban frontiers foundation",
  c40: "c40 cities",
  "university college london": "ucl",
  holcim: "holcim foundation",
};
const norm = (n) => {
  const raw = (n ?? "").trim().toLowerCase();
  return ALIASES[raw] ?? raw;
};
const seedTimeline = (name) =>
  fallbackSettings.logos.find((l) => norm(l.name) === norm(name));

const logos = await client.fetch(`*[_id == "siteSettings"][0].logos`);
if (!logos?.length) {
  console.log("· Site Settings has no logos yet — nothing to seed");
} else {
  const patch = {};
  logos.forEach((logo, i) => {
    if (logo.description?.trim()) return;
    const seed = seedTimeline(logo.name);
    if (!seed) return;
    patch[`logos[${i}].years`] = seed.years;
    patch[`logos[${i}].description`] = seed.description;
    if (seed.timelineGroup)
      patch[`logos[${i}].timelineGroup`] = seed.timelineGroup;
  });
  const filled = Object.keys(patch).length;
  if (filled) {
    await client.patch("siteSettings").set(patch).commit();
    console.log(`✓ Timeline: filled in ${filled} field(s) — now editable in Studio`);
  } else {
    console.log("· Timeline: everything already filled in from Studio");
  }
}

console.log("\nDone. Reload /studio.");
