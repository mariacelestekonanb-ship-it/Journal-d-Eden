-- =============================================================================
-- planning — Créneaux de prière (structure uniquement, module à venir)
-- =============================================================================

create table if not exists public.planning (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  prayer_leader_id uuid references public.profiles (id),
  prayer_topic_id uuid references public.prayer_topics (id),
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint planning_time_check check (end_time > start_time)
);

comment on table public.planning is 'Créneaux planifiés, assignés à un conducteur de prière (prayer_leader_id).';

create index if not exists planning_slot_date_idx on public.planning (slot_date);
create index if not exists planning_prayer_leader_idx on public.planning (prayer_leader_id);
create index if not exists planning_prayer_topic_idx on public.planning (prayer_topic_id);

drop trigger if exists planning_set_updated_at on public.planning;
create trigger planning_set_updated_at
  before update on public.planning
  for each row execute function public.set_updated_at();
