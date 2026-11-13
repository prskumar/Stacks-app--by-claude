import { createClient } from "@/lib/supabase/server";
import type { Article, Share } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareSheet } from "@/components/ShareSheet";

export default async function YouPage() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: articles } = await supabase.from("articles").select("*");
  const { data: shares } = await supabase
    .from("shares")
    .select("*")
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  const all = (articles ?? []) as Article[];
  const read = all.filter((a) => a.is_read).length;
  const followUps = all.filter((a) => a.is_follow_up).length;

  return (
    <main className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="font-display text-2xl mb-4">You</h1>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Saved", value: all.length },
          { label: "Read", value: read },
          { label: "Follow-ups", value: followUps },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
            <p className="font-display text-xl">{stat.value}</p>
            <p className="text-xs text-ink-faint">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border p-3.5" style={{ borderColor: "var(--line)" }}>
        <div>
          <p className="text-sm font-medium">Appearance</p>
          <p className="text-xs text-ink-faint">{user.user?.email}</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mt-4">
        <ShareSheet initialShare={(shares?.[0] as Share) ?? null} />
      </div>
    </main>
  );
}
