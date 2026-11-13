# Handoff: The Stacks

This app was built in a Claude Cowork cloud session that couldn't get GitHub
push access working (session/repo-binding issue in that product, not a code
problem). It's being handed off to Claude Code running locally, where none of
that applies — just normal `git`/`gh` on your own machine.

## What's already done

- Full Next.js 14 app (App Router, TypeScript, Tailwind) — all 5 tabs (Queue,
  Library, Follow-ups, Notes, You), magic-link login, a public view-only
  share page (`/s/[token]`), PWA support via Serwist.
- Supabase schema (`supabase/schema.sql`) — `articles`, `notes`,
  `note_articles`, `shares`, `share_invitees` tables, full Row Level
  Security, and a `get_shared_articles()` RPC for the public share link.
- Seed data (`supabase/seed.sql`) — migrates the 8 articles already in the
  live "Stacks" dashboard artifact (claude.ai/code/artifact/8a3aeeb1-...)
  into the new schema, matched to your account by email.
- `README.md` has the full one-time setup walkthrough (Supabase → Vercel →
  env vars → seed).
- One git commit already made (`9c658f0`) — everything above is in it.

## What's NOT done / known gaps

- **Never run `npm install` or `next build`** — the cloud sandbox this was
  built in had no general internet access, so nothing here has been
  type-checked or built. Run `npm install && npm run build` locally first
  and fix whatever surfaces (should be close, but Next 14 + Serwist +
  next-themes versions in `package.json` haven't been battle-tested together
  in this exact combo).
- **PWA icons are referenced but don't exist** — `public/manifest.webmanifest`
  points at `/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png`.
  App works fine without them; "Add to Home Screen" will just use a default
  icon until you add real ones.
- **Nothing pushed to GitHub yet.** A repo `prskumar/Stacks-app--by-claude`
  already exists (with a README, so it has its own initial commit that this
  local repo doesn't share history with).

## Immediate next step

The existing GitHub repo has an unrelated initial commit (its own README).
Push with `--allow-unrelated-histories`, or just force-push over it since
nothing of value is in that repo yet:

```bash
git remote add origin https://github.com/prskumar/Stacks-app--by-claude.git
git fetch origin
git push -u origin master --force
```

(`--force` is safe here — the only thing on the remote is a README GitHub
auto-generated, nothing to lose.)

Then follow `README.md` for Supabase project creation, env vars, Vercel
import, and running `seed.sql`.
