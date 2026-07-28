-- =============================================================================
-- reports — Comptes rendus (structure uniquement, module à venir)
-- Un seul compte rendu par créneau de planning.
-- =============================================================================

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  planning_id uuid not null unique references public.planning (id) on delete cascade,
  prayer_leader_id uuid not null references public.profiles (id),
  attendees_count integer check (attendees_count >= 0),
  topics_covered text,
  content text not null,
  follow_up text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.reports is 'Compte rendu rédigé par le conducteur de prière assigné à un créneau.';

create index if not exists reports_prayer_leader_idx on public.reports (prayer_leader_id);

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();
