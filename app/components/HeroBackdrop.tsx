"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProjectImage } from "../../sanity/queries";

type Props = {
  images: ProjectImage[];
};

declare global {
  interface Window {
    __heroPick?: number;
  }
}

/**
 * Random hero background with zero blank-frame guarantee.
 *
 * The LQIP data-URIs are embedded in the initial HTML together with an
 * inline script that runs during parse — before first paint. The script
 * picks the random index, paints the blurry LQIP as a CSS background and
 * stashes the index on `window.__heroPick`. After hydration the client
 * loads the matching full-res image and fades it in over the blur, so the
 * viewer never sees a black or grey frame — only blurry photo → sharp photo.
 */
export default function HeroBackdrop({ images }: Props) {
  const [pick, setPick] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;
    const idx =
      typeof window.__heroPick === "number" &&
      window.__heroPick >= 0 &&
      window.__heroPick < images.length
        ? window.__heroPick
        : Math.floor(Math.random() * images.length);
    setPick(idx);
  }, [images]);

  if (images.length === 0) return null;

  const lqips = images.map((img) => img.lqip ?? "");
  const bootScript = `(function(){try{var l=${JSON.stringify(
    lqips
  )};var i=Math.floor(Math.random()*l.length);window.__heroPick=i;var el=document.getElementById("hero-lqip");if(el&&l[i])el.style.backgroundImage="url('"+l[i]+"')";}catch(e){}})();`;

  const img = pick != null ? images[pick] : null;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        id="hero-lqip"
        suppressHydrationWarning
        className="absolute inset-0 bg-cover bg-center"
        style={{ transform: "scale(1.08)", filter: "blur(14px)" }}
      />
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      {img?.url && (
        <Image
          src={img.url}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          priority
          placeholder="empty"
          onLoad={() => setLoaded(true)}
          className="object-cover transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
