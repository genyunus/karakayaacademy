create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  full_name text not null,
  email_address text not null,
  phone_number text not null,
  interest text not null,
  title text not null,
  message_body text not null,
  source text not null default 'website'
);

create table if not exists class_booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  class_slug text not null,
  class_name text not null,
  first_name text not null,
  last_name text not null,
  full_name text not null,
  email_address text not null,
  phone_number text not null,
  interest text not null,
  title text not null,
  message_body text not null,
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

alter table if exists inquiries
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists full_name text,
  add column if not exists email_address text,
  add column if not exists phone_number text,
  add column if not exists title text,
  add column if not exists message_body text;

update inquiries
set
  first_name = coalesce(first_name, split_part(name, ' ', 1), ''),
  last_name = coalesce(last_name, nullif(trim(replace(name, split_part(name, ' ', 1), '')), ''), ''),
  full_name = coalesce(full_name, name, ''),
  email_address = coalesce(email_address, email, ''),
  title = coalesce(title, interest, ''),
  message_body = coalesce(message_body, message, '')
where
  first_name is null
  or last_name is null
  or full_name is null
  or email_address is null
  or title is null
  or message_body is null;

alter table if exists class_booking_requests
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists full_name text,
  add column if not exists email_address text,
  add column if not exists phone_number text,
  add column if not exists interest text,
  add column if not exists title text,
  add column if not exists message_body text;

update class_booking_requests
set
  first_name = coalesce(first_name, split_part(customer_name, ' ', 1), ''),
  last_name = coalesce(last_name, nullif(trim(replace(customer_name, split_part(customer_name, ' ', 1), '')), ''), ''),
  full_name = coalesce(full_name, customer_name, ''),
  email_address = coalesce(email_address, customer_email, ''),
  title = coalesce(title, class_name, '')
where
  first_name is null
  or last_name is null
  or full_name is null
  or email_address is null
  or title is null;
