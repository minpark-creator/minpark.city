"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  if (vimeo)
    return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0`;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt)
    return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&modestbranding=1&playsinline=1`;
  return null;
}

function PosterLayer({ film }: { film: Film }) {
  const posterUrl = film.poster?.url ?? null;
  if (!posterUrl) return null;
  return (
    <Image
      src={posterUrl}
      alt=""
      fill
      sizes="(max-width: 1024px) 100vw, 1200px"
      placeholder={film.poster?.lqip ? "blur" : "empty"}
      blurDataURL={film.poster?.lqip ?? undefined}
      className="object-cover"
    />
  );
}

function LoadingIndicator({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ease-out bg-white"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span className="block w-7 h-7 rounded-full border-2 border-neutral-300 border-t-neutral-500 animate-spin" />
    </div>
  );
}

function FilmPlayer({ film }: { film: Film }) {
  const embed = toEmbed(film.videoUrl);
  const directUrl = film.videoFileUrl || (film.videoUrl && !embed ? film.videoUrl : null);
  const [ready, setReady] = useState(false);
  const filmKey = film._id;

  if (embed) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-paper">
        <PosterLayer film={film} />
        <LoadingIndicator visible={!ready} />
        <iframe
          key={filmKey}
          src={embed}
          loading="lazy"
          onLoad={() => setReady(true)}
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ease-out"
          style={{ opacity: ready ? 1 : 0 }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={film.title}
        />
      </div>
    );
  }

  if (directUrl) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-paper">
        <PosterLayer film={film} />
        <LoadingIndicator visible={!ready} />
        <video
          key={filmKey}
          src={directUrl}
          poster={film.poster?.url ?? undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: ready ? 1 : 0 }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-paper">
      <PosterLayer film={film} />
    </div>
  );
}

export default function FilmClient({ films }: { films: Film[] }) {
  const [activeId, setActiveId] = useState(films[0]?._id ?? null);
  const active = films.find((f) => f._id === activeId) ?? films[0];

  /*
    The list is capped at the height of the player beside it. Tying the two
    together is what makes the column actually scroll: left to a viewport
    fraction it was taller than its own contents on a big screen, so there was
    nothing to scroll and the wheel did nothing.
  */
  const playerRef = useRef<HTMLDivElement>(null);
  const [listMax, setListMax] = useState<number | undefined>();

  useEffect(() => {
    const el = playerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) =>
      setListMax(Math.round(entry.contentRect.height))
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    /*
      Player on the left, list on the right. The player is sticky, so it holds
      its place while the titles scroll past it and the selection changes
      under a fixed frame. Below lg the two stack and the player pins to the
      top of the viewport instead.
    */
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8">
      <div className="lg:col-span-8 xl:col-span-9">
        {active && (
          <div className="lg:sticky lg:top-[110px]" ref={playerRef}>
            <FilmPlayer key={active._id} film={active} />
            <div className="pt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span className="subhead text-[17px]">{active.title}</span>
              <span className="text-muted">{formatDate(active.date)}</span>
            </div>
            {active.location && (
              <p className="mt-1 text-muted">{active.location}</p>
            )}
            {active.caption && (
              <p className="mt-2 text-muted leading-[1.5] max-w-[56ch]">
                {active.caption}
              </p>
            )}
          </div>
        )}
      </div>

      {/*
        The list keeps its own scrollbar and swallows the wheel at its edges,
        so pointing at the titles scrolls the titles rather than the page.
      */}
      <ul
        className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-[110px] lg:overflow-y-auto lg:overscroll-contain lg:pr-2 film-list"
        style={listMax ? ({ ["--list-max" as string]: `${listMax}px` }) : undefined}
      >
        {films.map((film) => {
          const isActive = film._id === active?._id;
          return (
            <li key={film._id} className="border-t border-rule first:border-t-0">
              <button
                type="button"
                onClick={() => setActiveId(film._id)}
                aria-current={isActive ? "true" : undefined}
                className="w-full text-left py-3 transition-colors"
                style={{ color: isActive ? "var(--red)" : undefined }}
              >
                <div className="subhead text-[14px] sm:text-[15px] leading-[1.25]">
                  {film.title}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 text-[12px] text-muted">
                  {film.location && <span>{film.location}</span>}
                  <span>{formatDate(film.date)}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
