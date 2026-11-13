"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Article, TimeBucket } from "@/lib/types";
import { bucketFor } from "@/lib/types";

const CHIPS: { key: TimeBucket | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "5", label: "~5 min" },
  { key: "15", label: "~15 min" },
  { key: "30", label: "30+ min" },
  { key: "video", label: "Video" },
];

export function QueueList({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<TimeBucket | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? articles : articles.filter((a) => bucketFor(a) === active)),
    [articles, active]
  );

  const thisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return filtered.filter((a) => new Date(a.added_at).getTime() >= weekAgo);
  }, [filtered]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setActive(chip.key)}
            className={clsx(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active === chip.key ? "border-transparent" : "text-ink-soft"
            )}
            style={
              active === chip.key
                ? { background: "var(--ink)", color: "var(--paper)" }
                : { borderColor: "var(--line)" }
            }
          >
            {chip.label}
          </button>
        ))}
      </div>

      <h3 className="mt-5 mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
        This week ({thisWeek.length})
      </h3>
      <ul className="space-y-2">
        {thisWeek.map((a) => (
          <li key={a.id}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm hover:bg-surface-soft transition-colors"
              style={{ borderColor: "var(--line)" }}
            >
              <span className="truncate pr-3">{a.title}</span>
              <span className="shrink-0 text-xs text-ink-faint">{a.read_time ?? "Video"}</span>
            </a>
          </li>
        ))}
        {thisWeek.length === 0 && (
          <li className="text-sm text-ink-faint">Nothing matches that filter this week.</li>
        )}
      </ul>
    </div>
  );
}
