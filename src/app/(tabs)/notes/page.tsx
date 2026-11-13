import { createClient } from "@/lib/supabase/server";
import type { Article, Note } from "@/lib/types";
import { NotebookView } from "@/components/NotebookView";

export default async function NotesPage() {
  const supabase = createClient();

  const [{ data: notes }, { data: links }, { data: articles }] = await Promise.all([
    supabase.from("notes").select("*").order("created_at", { ascending: false }),
    supabase.from("note_articles").select("note_id, article_id"),
    supabase.from("articles").select("*"),
  ]);

  const articleById = new Map((articles ?? []).map((a) => [a.id, a as Article]));

  const notesWithLinks = (notes ?? []).map((n) => {
    const linkedIds = (links ?? []).filter((l) => l.note_id === n.id).map((l) => l.article_id);
    return {
      ...(n as Note),
      linked_article_ids: linkedIds,
      linkedTitles: linkedIds.map((id) => articleById.get(id)?.title).filter(Boolean) as string[],
    };
  });

  return (
    <main className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="font-display text-2xl mb-4">Notes</h1>
      <NotebookView initialNotes={notesWithLinks} articles={(articles ?? []) as Article[]} />
    </main>
  );
}
