create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create table if not exists public.journal_entries (
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

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'journal_entries' and policyname = 'Public read journal entries'
  ) then
    create policy "Public read journal entries"
      on public.journal_entries
      for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'journal_entries' and policyname = 'Public insert journal entries'
  ) then
    create policy "Public insert journal entries"
      on public.journal_entries
      for insert
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read blog images'
  ) then
    create policy "Public read blog images"
      on storage.objects
      for select
      using (bucket_id = 'blog-images');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public upload blog images'
  ) then
    create policy "Public upload blog images"
      on storage.objects
      for insert
      with check (bucket_id = 'blog-images');
  end if;
end $$;
