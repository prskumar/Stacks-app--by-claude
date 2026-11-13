"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/types";

const CAT_VAR: Record<Article["category"], string> = {
  "Finance & Business": "--cat-finance",
  "AI Tools & News": "--cat-ai",
  "System Design": "--cat-sysdesign",
  "Interview Prep": "--cat-interview",
  Other: "--cat-other",
};

function pickDailyIndex(seed: string, length: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

export function TodaysPick({ unread }: { unread: Article[] }) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const pick = useMemo(() => {
    if (unread.length === 0) return null;
    const idx = pickDailyIndex(todayKey + ":" + shuffleSeed, unread.length);
    return unread[idx];
  }, [unread, todayKey, shuffleSeed]);

  if (!pick) {
    return (
      <div className="rounded-2xl border p-5 text-sm text-ink-soft" style={{ borderColor: "var(--line)" }}>
        Queue's empty — add something to The Stacks to get a pick here.
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-5 shadow-sm"
      style={{ borderColor: "var(--line)", background: "var(--surface)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          Today's pick
        </span>
        <button
          onClick={() => setShuffleSeed((s) => s + 1)}
          aria-label="Shuffle today's pick"
          className="rounded-full p-1.5 text-ink-faint hover:text-ink transition-colors"
        >
          ⟲
        </button>
      </div>
      <span
        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
        style={{
          background: `color-mix(in srgb, var(${CAT_VAR[pick.category]}) 16%, transparent)`,
          color: `var(${CAT_VAR[pick.category]})`,
        }}
      >
        {pick.category}
      </span>
      <h2 className="mt-2 font-display text-lg leading-snug">{pick.title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{pick.source} · {pick.read_time ?? "Video"}</p>
      <p className="mt-2 text-sm text-ink-soft line-clamp-3">{pick.summary}</p>
      <a
        href={pick.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        Open →
      </a>
    </div>
  );
}
