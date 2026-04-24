"use client";

import { useState } from "react";
import type { Film } from "../../sanity/queries";

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toEmbed(url?: string) {
  if (!url) return null;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=0&muted=0&title=0&byline=0&portrait=0`;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}

function FilmPlayer({ film }: { film: Film }) {
  const embed = toEmbed(film.videoUrl);
  const directUrl = film.videoFileUrl || (film.videoUrl && !embed ? film.videoUrl : null);

  if (embed) {
    return (
      <div className="relative w-full aspect-video overflow-hidden bg-black">
        <iframe
          src={embed}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={film.title}
        />
      </div>
    );
  }

  if (directUrl) {
    return (
      <video
        src={directUrl}
        poster={film.poster?.url ?? undefined}
        controls
        playsInline
        preload="metadata"
        className="w-full aspect-video object-cover bg-black"
      />
    );
  }

  return (
    <div className="w-full aspect-video" style={{ backgroundColor: "#efeae2" }} />
  );
}

export default function FilmClient({ films }: { films: Film[] }) {
  const [activeId, setActiveId] = useState(films[0]?._id ?? null);
  const active = films.find((f) => f._id === activeId) ?? films[0];

  return (
    <>
      {active && (
        <section className="pt-6 pb-12">
          <FilmPlayer film={active} />
          <div className="pt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[14px]">
            <span className="font-medium">{active.title}</span>
            <span className="text-muted">{formatDate(active.date)}</span>
          </div>
          {active.caption && (
            <p className="mt-2 text-[14px] text-muted leading-[1.6] max-w-[56ch]">
              {active.caption}
            </p>
          )}
        </section>
      )}

      <div className="pt-8 border-t border-neutral-200">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 pt-4">
          {films.map((film) => {
            const isActive = film._id === active?._id;
            return (
              <li key={film._id}>
                <button
                  type="button"
                  onClick={() => setActiveId(film._id)}
                  className={`w-full text-left py-3 border-b border-neutral-100 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`text-[15px] truncate ${
                        isActive ? "font-medium" : ""
                      }`}
                    >
                      {film.title}
                    </span>
                    <span className="text-[12px] text-muted shrink-0">
                      {formatDate(film.date)}
                    </span>
                  </div>
                  {film.location && (
                    <div className="text-[13px] text-muted mt-1">
                      {film.location}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
