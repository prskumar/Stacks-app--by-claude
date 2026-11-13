"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/queue` },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6">
      <h1 className="font-display text-2xl">The Stacks</h1>
      <p className="mt-1 text-sm text-ink-soft">Your reading & watching queue.</p>

      {sent ? (
        <p className="mt-6 text-center text-sm">
          Check <strong>{email}</strong> for a sign-in link.
        </p>
      ) : (
        <form onSubmit={sendLink} className="mt-6 w-full">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-full border px-4 py-2.5 text-sm bg-transparent"
            style={{ borderColor: "var(--line)" }}
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-full py-2.5 text-sm font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Send magic link
          </button>
          {error && <p className="mt-2 text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
        </form>
      )}
    </main>
  );
}
