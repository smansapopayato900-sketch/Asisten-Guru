-- Jalankan seluruh isi file ini di Supabase: SQL Editor > New query > Run
-- Setiap guru hanya bisa melihat & mengubah datanya sendiri (Row Level Security).

create table if not exists public.teacher_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  profile    jsonb not null default '{}'::jsonb,
  pin        text,
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  user_id    uuid not null references auth.users(id) on delete cascade,
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.messages (
  user_id    uuid not null references auth.users(id) on delete cascade,
  id         text not null,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists messages_user_created_idx
  on public.messages (user_id, created_at desc);

alter table public.teacher_profiles enable row level security;
alter table public.students        enable row level security;
alter table public.messages        enable row level security;

drop policy if exists "own profile"  on public.teacher_profiles;
drop policy if exists "own students" on public.students;
drop policy if exists "own messages" on public.messages;

create policy "own profile" on public.teacher_profiles
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own students" on public.students
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own messages" on public.messages
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
