"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Article, Category } from "@/lib/types";

const CATEGORIES: Category[] = [
  "Finance & Business",
  "AI Tools & News",
  "System Design",
  "Interview Prep",
  "Other",
];

function groupByRecency(articles: Article[]) {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const month = 30 * 24 * 60 * 60 * 1000;
  const groups: Record<"This week" | "This month" | "Older", Article[]> = {
    "This week": [],
    "This month": [],
    Older: [],
  };
  for (const a of articles) {
    const age = now - new Date(a.added_at).getTime();
    if (age <= week) groups["This week"].push(a);
    else if (age <= month) groups["This month"].push(a);
    else groups.Older.push(a);
  }
  return groups;
}

export function LibraryBrowser({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [dense, setDense] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, query, category]);

  const groups = useMemo(() => groupByRecency(filtered), [filtered]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, source, or tag…"
          className="flex-1 rounded-full border px-4 py-2 text-sm bg-transparent"
          style={{ borderColor: "var(--line)" }}
        />
        <button
          onClick={() => setDense((d) => !d)}
          className="shrink-0 rounded-full border px-3 py-2 text-xs"
          style={{ borderColor: "var(--line)" }}
        >
          {dense ? "Cards" : "Compact"}
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory("all")}
          className={clsx(
            "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
            category === "all" ? "border-transparent" : "text-ink-soft"
          )}
          style={category === "all" ? { background: "var(--ink)", color: "var(--paper)" } : { borderColor: "var(--line)" }}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={clsx(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
              category === c ? "border-transparent" : "text-ink-soft"
            )}
            style={category === c ? { background: "var(--ink)", color: "var(--paper)" } : { borderColor: "var(--line)" }}
          >
            {c}
          </button>
        ))}
      </div>

      {(["This week", "This month", "Older"] as const).map((label) =>
        groups[label].length === 0 ? null : (
          <section key={label} className="mt-5">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
              {label} ({groups[label].length})
            </h3>
            <ul className={dense ? "divide-y" : "space-y-2"} style={{ borderColor: "var(--line)" }}>
              {groups[label].map((a) =>
                dense ? (
                  <li key={a.id} className="py-2">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate pr-3">{a.title}</span>
                      <span className="shrink-0 text-xs text-ink-faint">{a.read_time ?? "Video"}</span>
                    </a>
                  </li>
                ) : (
                  <li key={a.id}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border p-3.5 hover:bg-surface-soft transition-colors"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="mt-1 text-xs text-ink-faint">
                        {a.source} · {a.read_time ?? "Video"} · {a.category}
                      </p>
                    </a>
                  </li>
                )
              )}
            </ul>
          </section>
        )
      )}

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-faint">Nothing matches.</p>
      )}
    </div>
  );
}
