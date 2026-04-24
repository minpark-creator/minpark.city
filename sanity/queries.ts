import { client, urlFor } from "./client";
import {
  fallbackProjects,
  fallbackSettings,
  fallbackAbout,
  fallbackContact,
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
  title: string;
  words: string[];
  intro: string;
  logos: LogoItem[];
  heroVideoUrl?: string;
  heroVideoFileUrl?: string | null;
  heroPoster?: HeroPoster | null;
};

export type AboutSection = {
  title: string;
  items: { year?: string; text?: string }[];
};

export type AboutPage = {
  headline: string;
  bio: unknown[];
  bioText?: string;
  sections: AboutSection[];
};

export type ContactPage = {
  headline: string;
  intro: string;
  email?: string;
  location?: string;
  links: { label: string; url: string }[];
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
type RawSettings = Omit<SiteSettings, "heroPoster"> & {
  heroPoster?: RawPoster | null;
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
  "height": asset->metadata.dimensions.height
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
    links[]{ _key, label, url },
    "images": images[]${IMAGE_PROJECTION}
  }`;

const SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    title, words, intro, heroVideoUrl,
    "heroVideoFileUrl": heroVideoFile.asset->url,
    "heroPoster": heroPoster${POSTER_PROJECTION},
    "logos": logos[]{ _key, name, url, height, "image": { "url": image.asset->url } }
  }`;

const ABOUT_QUERY = /* groq */ `
  *[_type == "aboutPage"][0]{ headline, bio, sections }`;

const CONTACT_QUERY = /* groq */ `
  *[_type == "contactPage"][0]{ headline, intro, email, location, links }`;

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
      title: s.title || fallbackSettings.title,
      words:
        s.words && s.words.length > 0 ? s.words : fallbackSettings.words,
      intro: s.intro || fallbackSettings.intro,
      logos: s.logos && s.logos.length > 0 ? s.logos : fallbackSettings.logos,
      heroVideoUrl: s.heroVideoUrl || fallbackSettings.heroVideoUrl,
      heroVideoFileUrl:
        s.heroVideoFileUrl ?? fallbackSettings.heroVideoFileUrl ?? null,
      heroPoster:
        toPoster(s.heroPoster) ?? fallbackSettings.heroPoster ?? null,
    };
  } catch {
    return fallbackSettings;
  }
}

export async function getAboutPage(): Promise<AboutPage> {
  if (!client) return fallbackAbout;
  try {
    const a = await client.fetch<AboutPage | null>(ABOUT_QUERY);
    return a ?? fallbackAbout;
  } catch {
    return fallbackAbout;
  }
}

export async function getContactPage(): Promise<ContactPage> {
  if (!client) return fallbackContact;
  try {
    const c = await client.fetch<ContactPage | null>(CONTACT_QUERY);
    return c ?? fallbackContact;
  } catch {
    return fallbackContact;
  }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  if (!client) return fallbackJournal;
  try {
    const j = await client.fetch<JournalEntry[]>(JOURNAL_QUERY);
    return j.length ? j : fallbackJournal;
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
