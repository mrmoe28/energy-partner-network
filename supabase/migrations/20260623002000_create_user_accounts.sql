create extension if not exists pgcrypto;

create table if not exists public.user_accounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  last_login_at timestamptz,
  email text not null unique,
  display_name text,
  password_hash text not null,
  role text not null default 'user',
  is_active boolean not null default true,
  constraint user_accounts_role_check check (role in ('admin', 'user'))
);

create index if not exists user_accounts_email_idx on public.user_accounts (email);
create index if not exists user_accounts_role_idx on public.user_accounts (role);
create index if not exists user_accounts_is_active_idx on public.user_accounts (is_active);

alter table public.user_accounts enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.user_accounts to authenticated;

drop policy if exists "Authenticated users can read user accounts" on public.user_accounts;
create policy "Authenticated users can read user accounts"
  on public.user_accounts
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can update user accounts" on public.user_accounts;
create policy "Authenticated users can update user accounts"
  on public.user_accounts
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can insert user accounts" on public.user_accounts;
create policy "Authenticated users can insert user accounts"
  on public.user_accounts
  for insert
  to authenticated
  with check (true);
