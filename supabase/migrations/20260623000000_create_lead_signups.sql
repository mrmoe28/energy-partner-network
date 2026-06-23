create extension if not exists pgcrypto;

create table if not exists public.lead_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  full_name text not null,
  email text not null,
  company text,
  phone text,
  partner_interest text not null,
  notes text,
  lead_source text not null default 'website',
  source_page text,
  status text not null default 'new',
  consent boolean not null default true
);

create index if not exists lead_signups_created_at_idx on public.lead_signups (created_at desc);
create index if not exists lead_signups_email_idx on public.lead_signups (email);
create index if not exists lead_signups_status_idx on public.lead_signups (status);
create index if not exists lead_signups_partner_interest_idx on public.lead_signups (partner_interest);

alter table public.lead_signups enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.lead_signups to anon, authenticated;
grant select, update on table public.lead_signups to authenticated;

create policy "Public can insert lead signups"
  on public.lead_signups
  for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can read lead signups"
  on public.lead_signups
  for select
  to authenticated
  using (true);

create policy "Authenticated users can update lead signups"
  on public.lead_signups
  for update
  to authenticated
  using (true)
  with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_lead_signups_updated_at on public.lead_signups;

create trigger set_lead_signups_updated_at
before update on public.lead_signups
for each row
execute function public.set_updated_at();
