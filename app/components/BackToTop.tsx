"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Hide again once the footer is on screen — the slim footer bar sits
    // exactly where this button does, and the two collide.
    const footer = document.querySelector("footer");
    let footerVisible = false;

    const update = () => setShown(window.scrollY > 700 && !footerVisible);

    const io = footer
      ? new IntersectionObserver(
          ([entry]) => {
            footerVisible = entry.isIntersecting;
            update();
          },
          { threshold: 0.15 }
        )
      : null;
    io?.observe(footer!);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-foreground text-background flex items-center justify-center transition-all duration-300"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(10px)",
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      ↑
    </button>
  );
}
