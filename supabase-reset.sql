-- Manmanji Supabase reset script.
-- Run this in Supabase SQL Editor when you want to recreate the shared publishing backend.
-- It keeps the existing storage bucket objects because Supabase blocks direct SQL deletion from storage tables.

create extension if not exists pgcrypto;

drop policy if exists "Public read journal entries" on public.journal_entries;
drop policy if exists "Public insert journal entries" on public.journal_entries;
drop table if exists public.journal_entries;

drop policy if exists "Public read blog images" on storage.objects;
drop policy if exists "Public upload blog images" on storage.objects;

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

create table public.journal_entries (
  id text primary key,
  type text not null check (type in ('diary', 'post', 'album')),
  title text not null,
  date date not null default current_date,
  category text not null default '',
  mood text not null default '',
  weather text not null default '',
  location text not null default '',
  tags jsonb not null default '[]'::jsonb,
  summary text not null default '',
  cover text not null default '',
  read_time text not null default '3 分钟',
  little_things jsonb not null default '[]'::jsonb,
  photos jsonb not null default '[]'::jsonb,
  body jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "Public read journal entries"
  on public.journal_entries
  for select
  using (true);

create policy "Public insert journal entries"
  on public.journal_entries
  for insert
  with check (true);

create policy "Public read blog images"
  on storage.objects
  for select
  using (bucket_id = 'blog-images');

create policy "Public upload blog images"
  on storage.objects
  for insert
  with check (bucket_id = 'blog-images');
