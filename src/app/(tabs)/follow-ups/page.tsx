import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";
import { FollowUpList } from "@/components/FollowUpList";

export default async function FollowUpsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("is_follow_up", true)
    .order("added_at", { ascending: false });

  return (
    <main className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="font-display text-2xl mb-4">Follow-ups</h1>
      <FollowUpList initial={(data ?? []) as Article[]} />
    </main>
  );
}
