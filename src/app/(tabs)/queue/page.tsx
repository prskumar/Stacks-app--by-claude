import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";
import { TodaysPick } from "@/components/TodaysPick";
import { QueueList } from "@/components/QueueList";

export default async function QueuePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("is_read", false)
    .order("added_at", { ascending: false });

  const unread = (data ?? []) as Article[];

  return (
    <main className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="font-display text-2xl mb-4">Queue</h1>
      <TodaysPick unread={unread} />
      <div className="mt-6">
        <QueueList articles={unread} />
      </div>
    </main>
  );
}
