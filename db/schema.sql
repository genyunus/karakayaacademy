create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  interest text not null,
  message text not null,
  source text not null default 'website'
);

create table if not exists class_booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  class_slug text not null,
  class_name text not null,
  customer_name text not null,
  customer_email text not null,
  status text not null default 'pending'
);

create table if not exists member_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  full_name text,
  stripe_customer_id text unique,
  membership_status text
);

create table if not exists package_purchases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  member_profile_id uuid references member_profiles(id) on delete set null,
  stripe_checkout_session_id text unique,
  package_slug text not null,
  package_name text not null,
  amount_paid_cents integer,
  currency text default 'usd',
  purchase_status text not null default 'pending'
);
