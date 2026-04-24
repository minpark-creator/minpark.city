"use client";

import { useEffect, useState } from "react";

type Props = {
  prefix: string;
  words: string[];
  intervalMs?: number;
};

export default function CyclingTitle({
  prefix,
  words,
  intervalMs = 2200,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  const currentWord = words[index] ?? "";

  return (
    <h1
      className="flex items-baseline tracking-[-0.01em]"
      style={{ fontSize: "60px", lineHeight: 1.1 }}
    >
      <span className="whitespace-pre">{prefix}</span>
      <span
        className="relative inline-block overflow-hidden align-baseline"
        style={{ paddingBottom: "0.18em" }}
      >
        <span className="invisible whitespace-pre" aria-hidden>
          {currentWord}
        </span>
        {words.map((word, i) => {
          const isCurrent = i === index;
          const isPrev = i === (index - 1 + words.length) % words.length;
          return (
            <span
              key={word + i}
              className="absolute left-0 top-0 whitespace-pre transition-all duration-500 ease-out"
              style={{
                opacity: isCurrent ? 1 : 0,
                transform: isCurrent
                  ? "translateY(0)"
                  : isPrev
                    ? "translateY(-100%)"
                    : "translateY(100%)",
              }}
              aria-hidden={!isCurrent}
            >
              {word}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
