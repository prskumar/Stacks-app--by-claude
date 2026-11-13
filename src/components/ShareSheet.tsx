"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Share } from "@/lib/types";

export function ShareSheet({ initialShare }: { initialShare: Share | null }) {
  const [share, setShare] = useState(initialShare);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const link = share ? `${typeof window !== "undefined" ? window.location.origin : ""}/s/${share.token}` : "";

  async function createShare() {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("shares")
      .insert({ owner_id: userData.user?.id, mode: "anyone_with_link", access_level: "view_only" })
      .select()
      .single();
    if (!error && data) setShare(data as Share);
  }

  async function revoke() {
    if (!share) return;
    await supabase.from("shares").update({ revoked_at: new Date().toISOString() }).eq("id", share.id);
    setShare(null);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-full py-2.5 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        Share my Stacks ↗
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/30" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-2xl p-5"
            style={{ background: "var(--surface)" }}
          >
            <h3 className="font-display text-lg">Share your library</h3>
            <p
              className="mt-2 rounded-lg px-3 py-2 text-xs"
              style={{ background: "var(--surface-soft)", color: "var(--ink-soft)" }}
            >
              Access: View only. Whoever has this link can browse your articles and videos —
              never your Notes, and never your account.
            </p>

            {share ? (
              <>
                <div
                  className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-2"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="flex-1 truncate text-xs">{link}</span>
                  <button
                    onClick={copyLink}
                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ background: "var(--ink)", color: "var(--paper)" }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <button
                  onClick={revoke}
                  className="mt-3 w-full rounded-full border py-2 text-sm"
                  style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
                >
                  Revoke link
                </button>
              </>
            ) : (
              <button
                onClick={createShare}
                className="mt-3 w-full rounded-full py-2.5 text-sm font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Create view-only link
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
