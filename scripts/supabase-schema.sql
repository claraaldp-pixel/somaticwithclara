-- Regulation by Design — Supabase schema
-- Paste this entire file into the Supabase SQL editor and click Run.

-- 1. Clients table
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  name       text not null,
  slug       text unique not null,
  created_at timestamptz default now()
);

-- 2. Reports table
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  content     text not null default '',
  published   boolean not null default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 3. Row Level Security — clients can only read their own report

alter table public.clients enable row level security;
alter table public.reports enable row level security;

-- Clients: a logged-in user can only see their own row
create policy "Clients: own row only"
  on public.clients for select
  using (email = auth.email());

-- Reports: a logged-in user can only see their own published report
create policy "Reports: own published report only"
  on public.reports for select
  using (
    published = true
    and client_id = (
      select id from public.clients where email = auth.email()
    )
  );

-- Service role bypasses RLS automatically (used by the publish script).
-- No additional policy needed for Clara's admin access via service key.
