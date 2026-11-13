-- The Stacks — Supabase schema
-- Single-owner app: one signed-in user (you, via magic link) owns everything.
-- Sharing is read-only and deliberately scoped to articles only — Notes stay
-- private, never exposed through a share link.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  url           text not null,
  source        text not null,
  type          text not null check (type in ('article', 'video')),
  category      text not null check (category in (
                  'Finance & Business', 'AI Tools & News', 'System Design',
                  'Interview Prep', 'Other'
                )),
  read_time     text,
  tags          text[] not null default '{}',
  summary       text not null default '',
  full_text     text,
  notes         text not null default '',
  is_read       boolean not null default false,
  is_follow_up  boolean not null default false,
  group_name    text,
  added_at      timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists articles_owner_added_idx on public.articles (owner_id, added_at desc);
create index if not exists articles_owner_category_idx on public.articles (owner_id, category);
create index if not exists articles_tags_gin_idx on public.articles using gin (tags);

alter table public.articles enable row level security;

create policy "owner can read own articles" on public.articles
  for select using (auth.uid() = owner_id);
create policy "owner can insert own articles" on public.articles
  for insert with check (auth.uid() = owner_id);
create policy "owner can update own articles" on public.articles
  for update using (auth.uid() = owner_id);
create policy "owner can delete own articles" on public.articles
  for delete using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- notes — your freeform notebook. Never shared, by design.
-- ---------------------------------------------------------------------------
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists notes_owner_created_idx on public.notes (owner_id, created_at desc);

alter table public.notes enable row level security;

create policy "owner can manage own notes" on public.notes
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- many-to-many: one note can reference zero or more articles
create table if not exists public.note_articles (
  note_id     uuid not null references public.notes(id) on delete cascade,
  article_id  uuid not null references public.articles(id) on delete cascade,
  primary key (note_id, article_id)
);

alter table public.note_articles enable row level security;

create policy "owner can manage own note links" on public.note_articles
  for all using (
    exists (select 1 from public.notes n where n.id = note_id and n.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.notes n where n.id = note_id and n.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- shares — one row per active share link. "Whole library, view-only" per v1.
-- ---------------------------------------------------------------------------
create table if not exists public.shares (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  token       text not null unique default encode(gen_random_bytes(12), 'base64url'),
  mode        text not null check (mode in ('anyone_with_link', 'invite_only')) default 'anyone_with_link',
  access_level text not null check (access_level in ('view_only')) default 'view_only',
  created_at  timestamptz not null default now(),
  revoked_at  timestamptz
);

alter table public.shares enable row level security;

create policy "owner can manage own shares" on public.shares
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- invited viewers for invite_only shares (view-only, no account needed to view —
-- just recorded so you know who has access and can revoke one person at a time)
create table if not exists public.share_invitees (
  id          uuid primary key default gen_random_uuid(),
  share_id    uuid not null references public.shares(id) on delete cascade,
  email       text not null,
  name        text,
  added_at    timestamptz not null default now()
);

alter table public.share_invitees enable row level security;

create policy "owner can manage own share invitees" on public.share_invitees
  for all using (
    exists (select 1 from public.shares s where s.id = share_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.shares s where s.id = share_id and s.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Public, read-only access for a valid share token — the ONLY way an
-- unauthenticated visitor ever sees data. Runs as the definer, deliberately
-- bypassing RLS, but only ever returns articles (never notes) and only for a
-- token that exists and has not been revoked.
-- ---------------------------------------------------------------------------
create or replace function public.get_shared_articles(p_token text)
returns setof public.articles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  select owner_id into v_owner
  from public.shares
  where token = p_token and revoked_at is null;

  if v_owner is null then
    return;
  end if;

  return query
    select * from public.articles where owner_id = v_owner order by added_at desc;
end;
$$;

revoke all on function public.get_shared_articles(text) from public;
grant execute on function public.get_shared_articles(text) to anon, authenticated;
