"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Article, Note } from "@/lib/types";

type NoteWithLinks = Note & { linkedTitles: string[] };

export function NotebookView({
  initialNotes,
  articles,
}: {
  initialNotes: NoteWithLinks[];
  articles: Article[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "linked" | "unlinked">("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [linkArticleId, setLinkArticleId] = useState("");
  const supabase = createClient();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      if (filter === "linked" && n.linked_article_ids.length === 0) return false;
      if (filter === "unlinked" && n.linked_article_ids.length > 0) return false;
      if (!q) return true;
      return n.body.toLowerCase().includes(q) || n.linkedTitles.some((t) => t.toLowerCase().includes(q));
    });
  }, [notes, query, filter]);

  async function saveNote() {
    const body = draft.trim();
    if (!body) return;
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("notes")
      .insert({ body, owner_id: userData.user?.id })
      .select()
      .single();
    if (error || !data) return;

    let linkedTitles: string[] = [];
    if (linkArticleId) {
      await supabase.from("note_articles").insert({ note_id: data.id, article_id: linkArticleId });
      linkedTitles = [articles.find((a) => a.id === linkArticleId)?.title ?? ""].filter(Boolean);
    }

    setNotes((prev) => [
      {
        ...data,
        linked_article_ids: linkArticleId ? [linkArticleId] : [],
        linkedTitles,
      },
      ...prev,
    ]);
    setDraft("");
    setLinkArticleId("");
    setComposerOpen(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your notes…"
          className="flex-1 rounded-full border px-4 py-2 text-sm bg-transparent"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      <div className="mt-3 flex gap-2">
        {(["all", "linked", "unlinked"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full border px-3 py-1 text-xs font-medium capitalize"
            style={
              filter === f
                ? { background: "var(--ink)", color: "var(--paper)", borderColor: "transparent" }
                : { borderColor: "var(--line)" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {filtered.map((n) => (
          <li key={n.id} className="rounded-xl border p-3.5" style={{ borderColor: "var(--line)" }}>
            <p className="whitespace-pre-wrap text-sm">{n.body}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                {n.linkedTitles.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{ background: "var(--surface-soft)", color: "var(--ink-soft)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-xs text-ink-faint">
                {new Date(n.created_at).toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="mt-6 text-center text-sm text-ink-faint">No notes here yet.</p>
        )}
      </ul>

      <button
        onClick={() => setComposerOpen(true)}
        aria-label="New note"
        className="fixed bottom-24 right-5 flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-lg"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        +
      </button>

      {composerOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/30" onClick={() => setComposerOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-2xl p-4"
            style={{ background: "var(--surface)" }}
          >
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a note…"
              rows={4}
              className="w-full resize-none rounded-xl border bg-transparent p-3 text-sm"
              style={{ borderColor: "var(--line)" }}
            />
            <select
              value={linkArticleId}
              onChange={(e) => setLinkArticleId(e.target.value)}
              className="mt-2 w-full rounded-xl border bg-transparent p-2 text-sm"
              style={{ borderColor: "var(--line)" }}
            >
              <option value="">Not linked to an article</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <button
              onClick={saveNote}
              className="mt-3 w-full rounded-full py-2.5 text-sm font-medium"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Save note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
