import { client, urlFor } from "./client";
import {
  fallbackProjects,
  fallbackSettings,
  fallbackAbout,
  fallbackFilms,
  fallbackPageIntros,
  fallbackPublications,
} from "./fallback";

export type ProjectImage = {
  _key?: string;
  url: string | null;
  alt?: string;
  lqip?: string | null;
  width?: number | null;
  height?: number | null;
  /** Optional video file URL. If set, lightbox plays this in place of the image. */
  videoUrl?: string | null;
};

export type Project = {
  _id: string;
  title: string;
  slug?: string;
  year?: string;
  date?: string;
  client?: string;
  partners?: string;
  location?: string;
  role?: string;
  summary?: string;
  body?: string;
  isSelected?: boolean;
  /** "research" | "practice" | "design" — groups the home page list. */
  track?: string;
  images: ProjectImage[];
  /**
   * 1-based indices into `images`, set in Studio. Used to choose the cover and
   * the (up to) three Selected-row thumbnails. Order is preserved.
   */
  featured?: number[];
  links?: { label: string; url: string; _key?: string }[];
};

export type LogoItem = {
  _key?: string;
  name?: string;
  /** Timeline fields. A logo without a description stays out of the timeline. */
  years?: string;
  description?: string;
  /** Logos sharing a group key collapse into one timeline row. */
  timelineGroup?: string;
  url?: string;
  height?: number;
  image?: { url: string | null };
};

export type HeroPoster = {
  url: string | null;
  lqip?: string | null;
  width?: number | null;
  height?: number | null;
};

export type SiteSettings = {
  intro: string;
  logos: LogoItem[];
  heroImages?: ProjectImage[];
  logosEyebrow?: string;
  logosNote?: string;
  logosIntro?: string;
  footerName?: string;
  location?: string;
  origin?: string;
  availability?: string;
  contactNote?: string;
  phone?: string;
  /** Direct URL of the uploaded CV PDF, or null when none is set. */
  cvUrl?: string | null;
  /** Site Settings' own contact email, falling back to the About page's. */
  contactEmail?: string | null;
  socialLinks?: { _key?: string; label: string; url: string }[];
};

export type AboutSection = {
  title: string;
  items: { year?: string; text?: string }[];
};

export type AboutPage = {
  headline: string;
  bio: unknown[];
  bioText?: string;
  portrait?: {
    url: string | null;
    alt?: string;
    lqip?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  contactIntro?: string;
  email?: string;
  location?: string;
  links?: { label: string; url: string }[];
  sections: AboutSection[];
  education?: {
    years?: string;
    institution: string;
    degree?: string;
    focus?: string;
  }[];
};

/** Header copy for one inner page, edited in Studio under "Page Intros". */
export type PageHeader = {
  eyebrow?: string;
  title: string;
  intro?: string;
};

export type PageIntros = {
  work: PageHeader;
  film: PageHeader;
  publications: PageHeader;
  about: PageHeader;
};

export type Publication = {
  _id: string;
  title: string;
  kind?: string;
  year?: string;
  date?: string;
  venue?: string;
  authors?: string;
  abstract?: string;
  links?: { label: string; url: string; _key?: string }[];
};

export type Film = {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  caption?: string;
  videoUrl?: string;
  videoFileUrl?: string | null;
  poster?: {
    url: string | null;
    lqip?: string | null;
    width?: number | null;
    height?: number | null;
  };
};

type RawImage = {
  _key?: string;
  alt?: string;
  asset?: unknown;
  hotspot?: unknown;
  crop?: unknown;
  lqip?: string | null;
  width?: number | null;
  height?: number | null;
  videoUrl?: string | null;
};

type RawPoster = {
  asset?: unknown;
  hotspot?: unknown;
  crop?: unknown;
  lqip?: string | null;
  width?: number | null;
  height?: number | null;
};

type RawProject = Omit<Project, "images"> & { images?: RawImage[] };
type RawFilm = Omit<Film, "poster"> & { poster?: RawPoster | null };
type RawSettings = Omit<SiteSettings, "heroImages"> & {
  heroImages?: RawImage[];
};

/**
 * Ask the CDN for a WebP no wider than 2400px rather than the original.
 * `auto("format")` only converts when the requesting client sends the right
 * Accept header, which Next's image optimiser does not — so it was pulling
 * 2.6MB, 6773px-wide PNGs and timing out on them. Explicit fm=webp takes the
 * same asset to ~150KB, and 2400px still covers a 1200px container at 2x.
 */
function cdnUrl(raw: { asset?: unknown } | null | undefined): string | null {
  if (!raw?.asset) return null;
  return urlFor(raw)?.width(2400).format("webp").quality(85).url() ?? null;
}

function toImage(raw: RawImage | undefined): ProjectImage | null {
  if (!raw || !raw.asset) return null;
  const built = cdnUrl(raw);
  return {
    _key: raw._key,
    alt: raw.alt,
    url: built,
    lqip: raw.lqip ?? null,
    width: raw.width ?? null,
    height: raw.height ?? null,
    videoUrl: raw.videoUrl ?? null,
  };
}

function toPoster(raw: RawPoster | null | undefined) {
  if (!raw || !raw.asset) return null;
  const built = cdnUrl(raw);
  return {
    url: built,
    lqip: raw.lqip ?? null,
    width: raw.width ?? null,
    height: raw.height ?? null,
  };
}

const IMAGE_PROJECTION = /* groq */ `{
  _key, alt, asset, hotspot, crop,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "videoUrl": video.asset->url
}`;

const POSTER_PROJECTION = /* groq */ `{
  asset, hotspot, crop,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const PROJECTS_QUERY = /* groq */ `
  *[_type == "project"] | order(order asc, date desc) {
    _id, title, "slug": slug.current, year, date,
    client, partners, location, role, summary, body, isSelected, track,
    featured,
    links[]{ _key, label, url },
    "images": images[]${IMAGE_PROJECTION}
  }`;

const SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    intro,
    "heroImages": heroImages[]${IMAGE_PROJECTION},
    logosNote,
    footerName,
    location,
    origin,
    availability,
    contactNote,
    phone,
    "cvUrl": cv.asset->url,
    logosEyebrow,
    logosIntro,
    "logos": logos[]{ _key, name, years, description, timelineGroup, url, height, "image": { "url": image.asset->url } },
    socialLinks[]{ _key, label, url },
    // Falls back to the About page so the email only has to be typed once.
    "contactEmail": coalesce(contactEmail, *[_type == "aboutPage"][0].email)
  }`;

const ABOUT_QUERY = /* groq */ `
  *[_type == "aboutPage"][0]{
    headline, bio, sections, education,
    contactIntro, email, location,
    links[]{ label, url },
    "portrait": portrait{
      alt, asset, hotspot, crop,
      "lqip": asset->metadata.lqip,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }`;

const PAGE_INTROS_QUERY = /* groq */ `
  *[_type == "pageIntros"][0]{
    work, film, publications, about
  }`;

const PUBLICATIONS_QUERY = /* groq */ `
  *[_type == "publication"] | order(order asc, date desc) {
    _id, title, kind, year, date, venue, authors, abstract,
    links[]{ _key, label, url }
  }`;

const FILMS_QUERY = /* groq */ `
  *[_type == "film"] | order(date desc) {
    _id, title, date, location, caption, videoUrl,
    "videoFileUrl": videoFile.asset->url,
    "poster": poster${POSTER_PROJECTION}
  }`;

/**
 * Provisional tracks, matched by title, for projects that have not been given
 * one in Studio yet. Anything set in Studio wins; anything unlisted falls into
 * "Other". Delete an entry here once its project carries a real track.
 */
const TRACK_SEED: Record<string, string> = {
  "green belts 2.0 report": "research",
  "holcim foundation fellowship": "research",
  "europe-korea conference": "research",

  "symbiotic thamesmead": "planning",
  "stratford islands": "planning",
  "waste zoning": "planning",
  "data centre city masterplan": "planning",
  "micro publics: a second home for teens": "planning",
  "apt. prototype 273": "planning",
  "city in a park": "planning",
  "the ideal green collage": "planning",

  "mplan magazine issue 01": "editorial",
  "mplan mag website": "editorial",
  "mplan mag workshops": "editorial",
  "launch at omved gardens": "editorial",

  "plant a chair": "built",
  "play-scape pavillion": "built",
};

function hydrateProjects(raws: RawProject[]): Project[] {
  return raws.map((p) => ({
    ...p,
    track: p.track || TRACK_SEED[p.title.trim().toLowerCase()],
    images: (p.images ?? [])
      .map(toImage)
      .filter((img): img is ProjectImage => img !== null),
  }));
}

function hydrateFilms(raws: RawFilm[]): Film[] {
  return raws.map((f) => ({
    ...f,
    poster: toPoster(f.poster) ?? undefined,
  }));
}

export async function getProjects(): Promise<Project[]> {
  if (!client) return fallbackProjects;
  try {
    const r = await client.fetch<RawProject[]>(PROJECTS_QUERY);
    return r.length ? hydrateProjects(r) : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

/**
 * The logo images live in Studio; the timeline copy for each organisation may
 * not have been typed there yet. While the document carries no timeline copy
 * at all, seed every row from the entry with the same name so the timeline
 * still has something to say. The moment a single description is typed in
 * Studio, Studio is the whole truth — including the rows left blank, which
 * then drop out of the timeline as intended.
 */
const LOGO_ALIASES: Record<string, string> = {
  uff: "urban frontiers foundation",
  "c40": "c40 cities",
  "university college london": "ucl",
  holcim: "holcim foundation",
};

function mergeLogoTimeline(logos: LogoItem[]): LogoItem[] {
  const typedInStudio = logos.some((l) => l.description?.trim());
  if (typedInStudio) return logos;

  return logos.map((logo) => {
    const raw = (logo.name ?? "").trim().toLowerCase();
    const key = LOGO_ALIASES[raw] ?? raw;
    const seed = fallbackSettings.logos.find((l) => {
      const seedName = (l.name ?? "").trim().toLowerCase();
      return seedName === key || (LOGO_ALIASES[seedName] ?? seedName) === key;
    });
    if (!seed) return logo;
    return {
      ...logo,
      years: logo.years ?? seed.years,
      timelineGroup: logo.timelineGroup ?? seed.timelineGroup,
      description: seed.description,
    };
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return fallbackSettings;
  try {
    const s = await client.fetch<RawSettings | null>(SETTINGS_QUERY);
    if (!s) return fallbackSettings;
    return {
      intro: s.intro || fallbackSettings.intro,
      logos: mergeLogoTimeline(
        s.logos && s.logos.length > 0 ? s.logos : fallbackSettings.logos
      ),
      heroImages: (s.heroImages ?? [])
        .map(toImage)
        .filter((img): img is ProjectImage => img !== null),
      // Studio is the source of truth once filled in; the fallbacks only
      // apply when Sanity is unreachable or the fields are still empty.
      logosEyebrow: s.logosEyebrow || fallbackSettings.logosEyebrow,
      logosNote: s.logosNote || fallbackSettings.logosNote,
      logosIntro: s.logosIntro ?? fallbackSettings.logosIntro,
      footerName: s.footerName || fallbackSettings.footerName,
      location: s.location || fallbackSettings.location,
      origin: s.origin || fallbackSettings.origin,
      availability: s.availability || fallbackSettings.availability,
      contactNote: s.contactNote || fallbackSettings.contactNote,
      phone: s.phone || fallbackSettings.phone,
      cvUrl: s.cvUrl ?? null,
      contactEmail: s.contactEmail || fallbackSettings.contactEmail,
      socialLinks:
        s.socialLinks && s.socialLinks.length > 0
          ? s.socialLinks
          : fallbackSettings.socialLinks,
    };
  } catch {
    return fallbackSettings;
  }
}

type RawAbout = Omit<AboutPage, "portrait"> & {
  portrait?: (RawPoster & { alt?: string }) | null;
};

export async function getAboutPage(): Promise<AboutPage> {
  if (!client) return fallbackAbout;
  try {
    const a = await client.fetch<RawAbout | null>(ABOUT_QUERY);
    if (!a) return fallbackAbout;
    const bioText = a.bioText ?? portableTextToPlain(a.bio);
    const portraitBuilt = toPoster(a.portrait);
    const portrait = portraitBuilt
      ? { ...portraitBuilt, alt: a.portrait?.alt }
      : fallbackAbout.portrait ?? null;
    return {
      ...a,
      bioText: bioText || fallbackAbout.bioText,
      portrait,
    };
  } catch {
    return fallbackAbout;
  }
}


function portableTextToPlain(body: unknown): string {
  if (!Array.isArray(body)) return "";
  return body
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const b = block as { _type?: string; children?: unknown };
      if (b._type !== "block" || !Array.isArray(b.children)) return "";
      return b.children
        .map((c) => {
          if (!c || typeof c !== "object") return "";
          const span = c as { text?: string };
          return span.text ?? "";
        })
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

type RawPageIntros = Partial<
  Record<keyof PageIntros, Partial<PageHeader> | null>
>;

/**
 * Once the Page Intros document exists, Studio is what the page shows: a
 * description cleared there disappears from the site rather than springing
 * back to the seeded copy. Only the title falls back, so a page can never
 * lose its heading. The seeds apply as a whole when the document has not been
 * created yet, or when Sanity is unreachable.
 */
function mergeHeader(
  raw: Partial<PageHeader> | null | undefined,
  fb: PageHeader
): PageHeader {
  return {
    eyebrow: raw?.eyebrow?.trim() || undefined,
    title: raw?.title?.trim() || fb.title,
    intro: raw?.intro?.trim() || undefined,
  };
}

export async function getPageIntros(): Promise<PageIntros> {
  if (!client) return fallbackPageIntros;
  try {
    const p = await client.fetch<RawPageIntros | null>(PAGE_INTROS_QUERY);
    if (!p) return fallbackPageIntros;
    return {
      work: mergeHeader(p.work, fallbackPageIntros.work),
      film: mergeHeader(p.film, fallbackPageIntros.film),
      publications: mergeHeader(
        p.publications,
        fallbackPageIntros.publications
      ),
      about: mergeHeader(p.about, fallbackPageIntros.about),
    };
  } catch {
    return fallbackPageIntros;
  }
}

export async function getPublications(): Promise<Publication[]> {
  if (!client) return fallbackPublications;
  try {
    const p = await client.fetch<Publication[]>(PUBLICATIONS_QUERY);
    return p.length ? p : fallbackPublications;
  } catch {
    return fallbackPublications;
  }
}

export async function getFilms(): Promise<Film[]> {
  if (!client) return fallbackFilms;
  try {
    const f = await client.fetch<RawFilm[]>(FILMS_QUERY);
    return f.length ? hydrateFilms(f) : fallbackFilms;
  } catch {
    return fallbackFilms;
  }
}
