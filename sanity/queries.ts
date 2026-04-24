import { client } from "./client";
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
  asset?: unknown;
};

export type Project = {
  _id: string;
  title: string;
  slug?: string;
  year?: string;
  date?: string;
  client?: string;
  location?: string;
  role?: string;
  summary?: string;
  body?: string;
  isSelected?: boolean;
  images: ProjectImage[];
};

export type LogoItem = {
  _key?: string;
  name?: string;
  url?: string;
  height?: number;
  image?: { url: string | null };
};

export type SiteSettings = {
  title: string;
  words: string[];
  intro: string;
  logos: LogoItem[];
  heroVideoUrl?: string;
  heroVideoFileUrl?: string | null;
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
  poster?: { url: string | null };
};

const PROJECTS_QUERY = /* groq */ `
  *[_type == "project"] | order(order asc, date desc) {
    _id, title, "slug": slug.current, year, date,
    client, location, role, summary, body, isSelected,
    "images": images[]{ _key, alt, asset, "url": asset->url }
  }`;

const SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    title, words, intro, heroVideoUrl,
    "heroVideoFileUrl": heroVideoFile.asset->url,
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
    "poster": { "url": poster.asset->url }
  }`;

export async function getProjects(): Promise<Project[]> {
  if (!client) return fallbackProjects;
  try {
    const r = await client.fetch<Project[]>(PROJECTS_QUERY);
    return r.length ? r : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return fallbackSettings;
  try {
    const s = await client.fetch<SiteSettings | null>(SETTINGS_QUERY);
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
    const f = await client.fetch<Film[]>(FILMS_QUERY);
    return f.length ? f : fallbackFilms;
  } catch {
    return fallbackFilms;
  }
}
