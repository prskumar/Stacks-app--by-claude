"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/lib/types";

export function FollowUpList({ initial }: { initial: Article[] }) {
  const [items, setItems] = useState(initial);
  const supabase = createClient();

  async function unstar(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
    const { error } = await supabase.from("articles").update({ is_follow_up: false }).eq("id", id);
    if (error) {
      // put it back if the update failed
      setItems(initial);
    }
  }

  if (items.length === 0) {
    return (
      <p className="mt-8 text-center text-sm text-ink-faint">
        Star anything from Queue or Library to shortlist it here.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((a) => (
        <li
          key={a.id}
          className="flex items-center gap-3 rounded-xl border p-3.5"
          style={{ borderColor: "var(--line)" }}
        >
          <a href={a.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm">
            <p className="font-medium">{a.title}</p>
            <p className="mt-0.5 text-xs text-ink-faint">
              {a.source} · {a.read_time ?? "Video"}
            </p>
          </a>
          <button
            onClick={() => unstar(a.id)}
            aria-label="Remove from follow-ups"
            className="shrink-0 text-lg"
            style={{ color: "var(--brass)" }}
          >
            ★
          </button>
        </li>
      ))}
    </ul>
  );
}
