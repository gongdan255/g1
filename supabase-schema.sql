create extension if not exists pgcrypto;

create table if not exists public.posts (
  id text primary key,
  slug text unique not null,
  title text not null,
  category text not null default '随笔',
  date date not null default current_date,
  read_time text not null default '5 分钟',
  excerpt text not null default '',
  cover text not null default '',
  image_alt text not null default '',
  featured text not null default '',
  body jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  related jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'Public read posts'
  ) then
    create policy "Public read posts"
      on public.posts
      for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'Public insert posts'
  ) then
    create policy "Public insert posts"
      on public.posts
      for insert
      with check (true);
  end if;
end $$;
