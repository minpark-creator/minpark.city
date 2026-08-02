import { client, urlFor } from "./client";
import {
  fallbackProjects,
  fallbackSettings,
  fallbackAbout,
  fallbackJournal,
  fallbackFilms,
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
};

export type JournalEntry = {
  _id: string;
  title: string;
  date: string;
  excerpt?: string;
  body?: unknown[];
  bodyText?: string;
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

function toImage(raw: RawImage | undefined): ProjectImage | null {
  if (!raw || !raw.asset) return null;
  const built = urlFor(raw)?.auto("format").url() ?? null;
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
  const built = urlFor(raw)?.auto("format").url() ?? null;
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
    client, partners, location, role, summary, body, isSelected,
    featured,
    links[]{ _key, label, url },
    "images": images[]${IMAGE_PROJECTION}
  }`;

const SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    intro,
    "heroImages": heroImages[]${IMAGE_PROJECTION},
    "logos": logos[]{ _key, name, url, height, "image": { "url": image.asset->url } },
    socialLinks[]{ _key, label, url },
    // Falls back to the About page so the email only has to be typed once.
    "contactEmail": coalesce(contactEmail, *[_type == "aboutPage"][0].email)
  }`;

const ABOUT_QUERY = /* groq */ `
  *[_type == "aboutPage"][0]{
    headline, bio, sections,
    contactIntro, email, location,
    links[]{ label, url },
    "portrait": portrait{
      alt, asset, hotspot, crop,
      "lqip": asset->metadata.lqip,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }`;

const JOURNAL_QUERY = /* groq */ `
  *[_type == "journalEntry"] | order(date desc) {
    _id, title, date, excerpt, body
  }`;

const FILMS_QUERY = /* groq */ `
  *[_type == "film"] | order(date desc) {
    _id, title, date, location, caption, videoUrl,
    "videoFileUrl": videoFile.asset->url,
    "poster": poster${POSTER_PROJECTION}
  }`;

function hydrateProjects(raws: RawProject[]): Project[] {
  return raws.map((p) => ({
    ...p,
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

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return fallbackSettings;
  try {
    const s = await client.fetch<RawSettings | null>(SETTINGS_QUERY);
    if (!s) return fallbackSettings;
    return {
      intro: s.intro || fallbackSettings.intro,
      logos: s.logos && s.logos.length > 0 ? s.logos : fallbackSettings.logos,
      heroImages: (s.heroImages ?? [])
        .map(toImage)
        .filter((img): img is ProjectImage => img !== null),
      // Studio is the source of truth once filled in; the fallbacks only
      // apply when Sanity is unreachable or the fields are still empty.
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

export async function getJournalEntries(): Promise<JournalEntry[]> {
  if (!client) return fallbackJournal;
  try {
    const j = await client.fetch<JournalEntry[]>(JOURNAL_QUERY);
    if (!j.length) return fallbackJournal;
    return j.map((e) => ({ ...e, bodyText: portableTextToPlain(e.body) }));
  } catch {
    return fallbackJournal;
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
