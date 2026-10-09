begin;
-- Run this in your Supabase project's SQL Editor (Project → SQL Editor → New query).
-- Safe to reapply: preserves content and replaces the named policies.

create extension if not exists "pgcrypto";

-- ============ PROFILE (single row) ============
create table if not exists profile (
  id int primary key default 1,
  name text not null default 'Anjalee',
  tagline text not null default 'Product minded. Web built.',
  bio text not null default '',
  roles text[] not null default array['Product Management','Web Development'],
  profile_pic_url text,
  resume_url text,
  email text,
  linkedin_url text,
  github_url text,
  accent_color text not null default '#EE8FB5',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into profile (id) values (1) on conflict (id) do nothing;

-- ============ SECTIONS (flexible, admin can add/remove) ============
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  layout text not null default 'text', -- 'text' | 'two-col' | 'cards' | 'tags'
  content jsonb not null default '{}'::jsonb,
  position int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============ PROJECTS ============
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tech_stack text[] not null default '{}',
  image_url text,
  link_url text,  -- "Visit website" — live demo / deployed app
  repo_url text,  -- "View repository" — source code
  position int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============ EXPLICIT ADMIN ACCESS ============
-- Add the owner's Auth user ID here using the SQL Editor (see deployment guide).
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;

create or replace function public.is_portfolio_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

alter table public.projects add column if not exists repo_url text;

-- ============ ROW LEVEL SECURITY ============
alter table profile enable row level security;
alter table sections enable row level security;
alter table projects enable row level security;

-- Policies can be safely reapplied without dropping content.
drop policy if exists "public read profile" on profile;
create policy "public read profile" on profile for select to anon, authenticated using (true);
drop policy if exists "public read visible sections" on sections;
create policy "public read visible sections" on sections for select to anon, authenticated using (visible = true);
drop policy if exists "public read visible projects" on projects;
create policy "public read visible projects" on projects for select to anon, authenticated using (visible = true);
drop policy if exists "owner writes profile" on profile;
create policy "owner writes profile" on profile for update to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "owner all sections" on sections;
create policy "owner all sections" on sections for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "owner all projects" on projects;
create policy "owner all projects" on projects for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- ============ STORAGE ============
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif','application/pdf'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
drop policy if exists "owner write media" on storage.objects;
create policy "owner write media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_portfolio_admin());
drop policy if exists "owner update media" on storage.objects;
create policy "owner update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_portfolio_admin()) with check (bucket_id = 'media' and public.is_portfolio_admin());
drop policy if exists "owner delete media" on storage.objects;
create policy "owner delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_portfolio_admin());

commit;
