-- DealVerify v1 database foundation
-- Source of truth: Complete Product Brief, section 12.
-- Intended for Supabase/Postgres. Apply through a Supabase migration when a project is connected.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  pincode text,
  high_priority_threshold integer not null default 500,
  created_at timestamptz not null default now(),
  constraint users_pincode_format check (pincode is null or pincode ~ '^[0-9]{6}$'),
  constraint users_threshold_nonnegative check (high_priority_threshold >= 0)
);

create table if not exists public.monitored_accounts (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  active boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.verified_deals (
  id uuid primary key default gen_random_uuid(),
  product_title text not null,
  verified_price numeric(12,2) not null,
  claimed_price numeric(12,2) not null,
  product_url text not null,
  x_post_url text not null,
  history_note text not null,
  is_high_priority boolean not null default false,
  pincode_checked text not null,
  canonical_key text not null,
  first_seen_at timestamptz not null default now(),
  expires_at timestamptz,
  source_handle text,
  created_at timestamptz not null default now(),
  constraint verified_deals_price_nonnegative check (verified_price >= 0 and claimed_price >= 0),
  constraint verified_deals_pincode_format check (pincode_checked ~ '^[0-9]{6}$')
);

create table if not exists public.price_observations (
  id uuid primary key default gen_random_uuid(),
  canonical_key text not null,
  price numeric(12,2) not null,
  observed_at timestamptz not null default now(),
  constraint price_observations_price_nonnegative check (price >= 0)
);

create index if not exists verified_deals_pincode_first_seen_idx
  on public.verified_deals (pincode_checked, first_seen_at desc);

create index if not exists verified_deals_canonical_key_idx
  on public.verified_deals (canonical_key);

create index if not exists verified_deals_expires_at_idx
  on public.verified_deals (expires_at);

create index if not exists price_observations_canonical_observed_idx
  on public.price_observations (canonical_key, observed_at desc);

alter table public.users enable row level security;
alter table public.monitored_accounts enable row level security;
alter table public.verified_deals enable row level security;
alter table public.price_observations enable row level security;

drop policy if exists "users can read own settings" on public.users;
create policy "users can read own settings"
  on public.users for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "users can insert own settings" on public.users;
create policy "users can insert own settings"
  on public.users for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "users can update own settings" on public.users;
create policy "users can update own settings"
  on public.users for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "users can read matching verified deals" on public.verified_deals;
create policy "users can read matching verified deals"
  on public.verified_deals for select
  to authenticated
  using (
    pincode_checked = (
      select u.pincode from public.users u
      where u.id = (select auth.uid())
    )
  );

-- Deal ingestion and price observations are backend-only.
-- No anon/authenticated write policies are intentionally exposed here.
