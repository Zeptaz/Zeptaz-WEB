-- Zeptaz blog schema — run once in the Supabase SQL Editor.
-- (Reference copy; the app never executes this file.)

-- ── Posts ────────────────────────────────────────────────────────────────
create type post_status as enum ('draft', 'published');

create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null default '',
  slug             text not null unique,
  author           text not null default 'Zeptaz',     -- byline shown under the post title
  excerpt          text not null default '',           -- listing card + fallback meta description
  content_json     jsonb not null default '{}'::jsonb, -- canonical Tiptap document
  content_html     text not null default '',           -- sanitized render for the public site
  cover_image_url  text,
  tags             text[] not null default '{}',
  status           post_status not null default 'draft',
  meta_title       text,                               -- SEO overrides (null = fall back to title/excerpt)
  meta_description text,
  og_image_url     text,                               -- fallback: cover_image_url
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index posts_tags_gin on public.posts using gin (tags);
create index posts_published_idx on public.posts (status, published_at desc);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- ── Admin allowlist ──────────────────────────────────────────────────────
-- The anon key ships to the browser, so anyone who can sign up would land in
-- the `authenticated` role. Writes are therefore gated on an explicit
-- allowlist, not on merely being signed in. Add an editor:
--   insert into public.admins (email) values ('someone@zeptaz.com');
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- A signed-in user may read only their own row, so the exists() checks below
-- evaluate correctly under RLS without a SECURITY DEFINER helper.
create policy "read own admin row"
  on public.admins for select to authenticated
  using (email = auth.jwt() ->> 'email');

-- ── Row Level Security ───────────────────────────────────────────────────
alter table public.posts enable row level security;

create policy "public read published"
  on public.posts for select
  using (status = 'published');

create policy "admin full access"
  on public.posts for all
  to authenticated
  using      (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'))
  with check (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

-- ── Storage ──────────────────────────────────────────────────────────────
-- First create a PUBLIC bucket named `blog-images` in the dashboard
-- (Storage → New bucket, ~5MB limit, image/* MIME types), then run:

create policy "public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "admin insert blog images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images'
    and exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

create policy "admin update blog images"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-images'
    and exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

create policy "admin delete blog images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images'
    and exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));
