"use client";

import { useState } from "react";
import type { JournalEntry } from "../../sanity/queries";

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Paragraphs({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="space-y-5 text-[16px] leading-[1.75]">
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export default function JournalClient({
  entries,
}: {
  entries: JournalEntry[];
}) {
  const [activeId, setActiveId] = useState(entries[0]?._id ?? null);
  const active = entries.find((e) => e._id === activeId) ?? entries[0];

  return (
    <div className="grid grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10 pt-4">
      <aside className="col-span-12 md:col-span-4 md:sticky md:top-6 md:self-start">
        <ul className="space-y-[2px]">
          {entries.map((entry) => {
            const isActive = entry._id === active?._id;
            return (
              <li key={entry._id}>
                <button
                  type="button"
                  onClick={() => setActiveId(entry._id)}
                  className={`w-full text-left py-3 border-b border-neutral-100 transition-colors ${
                    isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className={`text-[15px] ${
                        isActive ? "font-medium" : ""
                      }`}
                    >
                      {entry.title}
                    </span>
                    <span className="font-ui text-[12px] text-muted shrink-0">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  {entry.excerpt && (
                    <div className="text-[13px] text-muted mt-1 line-clamp-2">
                      {entry.excerpt}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <article className="col-span-12 md:col-span-7 md:col-start-6">
        {active && (
          <>
            <header className="mb-8 pb-6 border-b border-neutral-200">
              <div className="font-ui text-[13px] text-muted">
                {formatDate(active.date)}
              </div>
              <h2 className="mt-2 text-[22px] sm:text-[26px] lg:text-[28px] font-medium leading-tight">
                {active.title}
              </h2>
            </header>
            <Paragraphs text={active.bodyText} />
          </>
        )}
      </article>
    </div>
  );
}
