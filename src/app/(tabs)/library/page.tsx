import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";
import { LibraryBrowser } from "@/components/LibraryBrowser";

export default async function LibraryPage() {
  const supabase = createClient();
  const { data } = await supabase.from("articles").select("*").order("added_at", { ascending: false });

  return (
    <main className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="font-display text-2xl mb-4">Library</h1>
      <LibraryBrowser articles={(data ?? []) as Article[]} />
    </main>
  );
}
