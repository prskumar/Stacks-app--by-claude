# The Stacks

Your personal reading/watching queue — Next.js + Supabase + Vercel, installable as a PWA.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind) — the app itself
- **Supabase** — Postgres + Auth (magic link) + Row Level Security
- **Vercel** — hosting, auto-deploys on every push to `main`
- **Serwist** — service worker for offline caching + "Add to Home Screen"

## One-time setup (do this once, in order)

1. **Create a Supabase project** at supabase.com (free tier is plenty). In the SQL
   editor, run `supabase/schema.sql` — this creates the `articles`, `notes`,
   `shares` tables and all the Row Level Security policies.
2. **Grab your API keys**: Supabase project settings → API → copy the `Project URL`
   and the `anon` `public` key.
3. **Push this repo to GitHub**, then import it on vercel.com ("Add New Project").
   Vercel auto-detects Next.js — no config needed.
4. **Set environment variables** in Vercel (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (same two values go in a local `.env.local` if you ever run it on your machine —
   see `.env.local.example`.)
5. **Deploy.** Vercel builds and gives you a URL.
6. **Sign in once** at `/login` with your email — this creates your `auth.users`
   row via magic link.
7. **Load your existing reading list**: in Supabase's SQL editor, run
   `supabase/seed.sql`. It inserts the 8 articles currently in the live Stacks
   artifact dashboard, matched to your account by email.

From then on, every `git push` to `main` auto-deploys.

## Project layout

```
src/app/(tabs)/        Queue, Library, Follow-ups, Notes, You — the 5 tabs
src/app/s/[token]/     Public view-only shared-library page
src/app/login/         Magic-link sign-in
src/components/        Client components (lists, share sheet, theme toggle…)
src/lib/supabase/      Browser + server Supabase clients
src/lib/types.ts       Shared TypeScript types
supabase/schema.sql    Tables + RLS policies — run once in Supabase's SQL editor
supabase/seed.sql       Your existing 8 articles — run once, after first sign-in
```

## Notes on the design

- Sharing is **view-only, whole-library**, via a revocable token — see
  `get_shared_articles()` in `schema.sql`. Notes are never exposed through a
  share link, by design.
- Light/dark tokens in `globals.css` are ported directly from the original
  artifact dashboard, so the look carries over.
- The icons referenced in `public/manifest.webmanifest`
  (`icons/icon-192.png` etc.) aren't generated yet — the app works fine
  without them, but add real ones before relying on "Add to Home Screen" for
  a polished icon.
