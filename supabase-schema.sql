-- Noor: Event Invite App - Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Events table
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  date date not null,
  time text not null,
  location text not null,
  host_name text not null,
  host_note text,
  enable_guest_notes boolean default true,
  enable_sms_reminders boolean default false,
  sms_reminder_hours integer default 3,
  show_guest_list boolean default false,
  created_at timestamp with time zone default now()
);

-- RSVPs table
create table if not exists rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  first_name text not null,
  attending boolean not null,
  note text,
  phone text,
  sms_opt_in boolean default false,
  created_at timestamp with time zone default now()
);

-- Index for fast lookups
create index if not exists idx_rsvps_event_id on rsvps(event_id);
create index if not exists idx_events_slug on events(slug);

-- Enable Row Level Security
alter table events enable row level security;
alter table rsvps enable row level security;

-- Policies: events are publicly readable, writable by anon for creation
create policy "Events are publicly readable" on events
  for select using (true);

create policy "Anyone can create events" on events
  for insert with check (true);

create policy "Anyone can update events" on events
  for update using (true);

-- Policies: RSVPs are publicly readable and writable
create policy "RSVPs are publicly readable" on rsvps
  for select using (true);

create policy "Anyone can create RSVPs" on rsvps
  for insert with check (true);
