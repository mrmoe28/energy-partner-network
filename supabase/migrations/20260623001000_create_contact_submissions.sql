create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  name text not null,
  email text not null,
  company text,
  partner_type text not null,
  message text not null,
  status text not null default 'new'
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

grant insert on table public.contact_submissions to anon, authenticated;
grant select, update on table public.contact_submissions to authenticated;

drop policy if exists "Allow public insert" on public.contact_submissions;
create policy "Allow public insert"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow authenticated read" on public.contact_submissions;
create policy "Allow authenticated read"
  on public.contact_submissions
  for select
  to authenticated
  using (true);

drop policy if exists "Allow authenticated update" on public.contact_submissions;
create policy "Allow authenticated update"
  on public.contact_submissions
  for update
  to authenticated
  using (true)
  with check (true);
