-- supabase/migrations/0001_quiz_funnel.sql

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  whatsapp text,
  company text,
  country text not null check (country in ('MY','SG','OTHER')),
  segment text not null check (segment in ('ops','team','sales','service')),
  urgency text not null check (urgency in ('low','med','high')),
  team_tier text not null check (team_tier in ('solo','2-5','6-20','20+')),
  answers jsonb not null,
  unsubscribed_at timestamptz,
  utm jsonb
);
create index leads_email_idx on leads (email);

create table scheduled_emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  template_key text not null,
  send_at timestamptz not null,
  sent_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending','in_flight','sent','failed','skipped')),
  error text,
  attempts int not null default 0
);
create index scheduled_emails_due_idx on scheduled_emails (status, send_at);

create table email_events (
  id bigserial primary key,
  lead_id uuid references leads(id) on delete cascade,
  template_key text not null,
  event_type text not null,
  at timestamptz not null default now(),
  payload jsonb
);
create index email_events_lead_idx on email_events (lead_id);
