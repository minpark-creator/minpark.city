/**
 * One-off migration, run by hand:
 *
 *   node scripts/migrate-timeline.mjs --dry-run   # reads only, no token
 *   node scripts/migrate-timeline.mjs             # writes
 *
 * Writing needs a Sanity token with Editor rights, read from
 * SANITY_API_WRITE_TOKEN in the environment or in .env.local (gitignored).
 *
 * Moves the home-page timeline off the old `siteSettings.logos` array and onto
 * Organisation documents plus a `siteSettings.timeline` array.
 *
 * Why: in the old shape a logo row carried its own years and description, so
 * an organisation could appear on the timeline exactly once. LH needs to
 * appear twice — once beside MOLIT on the 2025 policy briefing, and again on
 * its own later — which that shape cannot express. Organisations are now
 * documents, and a timeline entry references as many of them as it needs.
 *
 * What it does:
 *  1. Creates one Organisation document per logo, carrying the uploaded image
 *     asset across by reference (nothing is re-uploaded), skipping any
 *     organisation of that name that already exists.
 *  2. Builds one timeline entry per `timelineGroup` (ungrouped logos get an
 *     entry of their own), parsing the free-text `years` into start/end.
 *  3. Writes both, and leaves the old `logos` array untouched so nothing is
 *     lost. Empty it in Studio once the timeline reads correctly.
 *
 * Additive and re-runnable: it will not overwrite a `timeline` that already
 * has entries, and it will not duplicate organisations.
 *
 * The years it writes are only as precise as the old free-text field, i.e.
 * year-only. Open Site Settings afterwards and narrow each entry to the month
 * it finished — that is what makes the ordering exact.
 *
 * Get a token at https://www.sanity.io/manage → your project → API → Tokens.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const dryRun = process.argv.includes("--dry-run");

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    // Only split on the first "=" — a token can contain one.
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

// .env.local is gitignored, so the token can live there rather than being
// typed on a command line that ends up in the shell history.
const token = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN;

// --dry-run only reads, and the dataset is public, so it needs no token.
if (!token && !dryRun) {
  console.error(
    "No write token found. Add this line to .env.local:\n" +
      "  SANITY_API_WRITE_TOKEN=sk...\n" +
      "Get one with Editor rights at https://www.sanity.io/manage → your\n" +
      "project → API → Tokens.\n\n" +
      "Or preview what this would do, no token needed:\n" +
      "  node scripts/migrate-timeline.mjs --dry-run"
  );
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const slug = (s) =>
  (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "org";

/** "2024–2026" → { start: "2024", end: "2026" }. Year precision, at best. */
function parseYears(years) {
  const found = (years ?? "").match(/\d{4}/g) ?? [];
  return { start: found[0], end: found[found.length - 1] };
}

const settings = await client.fetch(
  `*[_type == "siteSettings"][0]{ _id, logos, timeline }`
);
if (!settings) {
  console.error("No siteSettings document found. Nothing to migrate.");
  process.exit(1);
}
const logos = settings.logos ?? [];
if (logos.length === 0) {
  console.error("Site Settings has no logos. Nothing to migrate.");
  process.exit(1);
}
if ((settings.timeline ?? []).length > 0) {
  console.error(
    `Site Settings already has ${settings.timeline.length} timeline entries.\n` +
      "Refusing to overwrite them. Clear the Timeline field in Studio first if\n" +
      "you really want to rebuild it from the old logos array."
  );
  process.exit(1);
}

// 1 — one Organisation document per logo.
const existing = await client.fetch(
  `*[_type == "organisation"]{ _id, name }`
);
const byName = new Map(
  existing.map((o) => [(o.name ?? "").trim().toLowerCase(), o._id])
);

const idFor = new Map(); // logo _key → organisation _id
const creates = [];

logos.forEach((logo, i) => {
  const name = (logo.name ?? "").trim();
  if (!name) return;
  const known = byName.get(name.toLowerCase());
  if (known) {
    idFor.set(logo._key, known);
    console.log(`· ${name} — organisation already exists, reusing it`);
    return;
  }
  // No dot in the id: Sanity treats a document whose _id contains a period as
  // private, readable only with a token, which would hide the logos from the
  // live site while looking perfectly fine in Studio.
  const _id = `organisation-${slug(name)}`;
  idFor.set(logo._key, _id);
  byName.set(name.toLowerCase(), _id);
  creates.push({
    _id,
    _type: "organisation",
    name,
    // The asset reference is copied as-is: the same uploaded file, no re-upload.
    ...(logo.image ? { logo: logo.image } : {}),
    ...(logo.height ? { height: logo.height } : {}),
    ...(logo.url ? { url: logo.url } : {}),
    showInMarquee: true,
    order: i + 1,
  });
});

// 2 — one timeline entry per group.
const order = [];
const groups = new Map();
for (const logo of logos) {
  const key = logo.timelineGroup?.trim() || logo._key || logo.name || "";
  if (!groups.has(key)) {
    groups.set(key, []);
    order.push(key);
  }
  groups.get(key).push(logo);
}

const timeline = order
  .map((key) => {
    const members = groups.get(key);
    const described = members.find((m) => m.description?.trim());
    if (!described) return null;
    const years = members.find((m) => m.years?.trim())?.years;
    const refs = members
      .map((m) => idFor.get(m._key))
      .filter(Boolean)
      .map((id, i) => ({
        _type: "reference",
        _key: `ref-${slug(key)}-${i}`,
        _ref: id,
      }));
    if (refs.length === 0) return null;
    const { start, end } = parseYears(years);
    return {
      _type: "timelineEntry",
      _key: `tl-${slug(key)}`,
      organisations: refs,
      ...(start ? { start } : {}),
      ...(end ? { end } : {}),
      ongoing: false,
      description: described.description.trim(),
    };
  })
  .filter(Boolean);

console.log(
  `\n${creates.length} organisation(s) to create, ` +
    `${timeline.length} timeline entr(y|ies) to write.`
);
for (const entry of timeline) {
  const names = entry.organisations
    .map((r) => r._ref.replace(/^organisation-/, ""))
    .join(" + ");
  console.log(
    `  ${[entry.start, entry.end].filter(Boolean).join("–") || "(undated)"}  ${names}`
  );
}

if (dryRun) {
  console.log("\n--dry-run: nothing written.");
  process.exit(0);
}

const tx = client.transaction();
for (const doc of creates) tx.createIfNotExists(doc);
tx.patch(settings._id, (p) => p.set({ timeline }));
await tx.commit();

console.log(
  "\n✓ Migrated.\n" +
    "  The old `logos` array is untouched — Studio shows it greyed out under\n" +
    "  'Logos (old, replaced by Organisations)'. Check the timeline reads\n" +
    "  right, narrow each entry's dates to the month, then empty that array.\n" +
    "  Entries that share a row (MOLIT + LH) came across as one entry; add a\n" +
    "  second entry pointing at LH alone for its later work."
);
