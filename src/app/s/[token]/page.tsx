import { createClient } from "@supabase/supabase-js";
import type { Article } from "@/lib/types";
import { LibraryBrowser } from "@/components/LibraryBrowser";

// Public, unauthenticated view of a shared link. Reads only ever go through
// the get_shared_articles() RPC (security definer, revocation-aware) — this
// page never queries public.articles directly, and never touches notes.
export default async function SharedLibraryPage({ params }: { params: { token: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.rpc("get_shared_articles", { p_token: params.token });

  if (error || !data || data.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-xl">Link not found</h1>
        <p className="mt-2 text-sm text-ink-soft">
          This share link is invalid, revoked, or the library is empty.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-4 rounded-xl border p-3 text-xs" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
        You're viewing a shared library — view only.
      </div>
      <h1 className="font-display text-2xl mb-4">The Stacks</h1>
      <LibraryBrowser articles={data as Article[]} />
    </main>
  );
}
