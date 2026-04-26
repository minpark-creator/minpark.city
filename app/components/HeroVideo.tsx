"use client";

import Image from "next/image";
import { useState } from "react";
import type { HeroPoster } from "../../sanity/queries";

type Props = {
  url?: string;
  fileUrl?: string | null;
  poster?: HeroPoster | null;
};

function toEmbed(url?: string) {
  if (!url) return null;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo)
    return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0`;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt)
    return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&modestbranding=1&playsinline=1`;
  return null;
}

function LoadingFrame({ visible }: { visible: boolean }) {
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

export default function HeroVideo({ url, fileUrl, poster }: Props) {
  const embed = toEmbed(url);
  const direct = fileUrl || (url && !embed ? url : null);
  const posterUrl = poster?.url ?? null;
  const [ready, setReady] = useState(false);

  return (
    <section className="pb-12">
      <div className="relative w-full aspect-video overflow-hidden bg-white">
        {posterUrl && (
          <Image
            src={posterUrl}
            alt=""
            fill
            sizes="100vw"
            priority
            placeholder={poster?.lqip ? "blur" : "empty"}
            blurDataURL={poster?.lqip ?? undefined}
            className="object-cover"
          />
        )}
        <LoadingFrame visible={!ready && !!(embed || direct)} />
        {embed ? (
          <iframe
            src={embed}
            loading="lazy"
            onLoad={() => setReady(true)}
            className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ease-out"
            style={{ opacity: ready ? 1 : 0 }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Hero video"
          />
        ) : direct ? (
          <video
            src={direct}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={posterUrl ?? undefined}
            onLoadedData={() => setReady(true)}
            onCanPlay={() => setReady(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: ready ? 1 : 0 }}
          />
        ) : !posterUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] text-muted">
              Add a hero video in Studio → Site Settings
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
