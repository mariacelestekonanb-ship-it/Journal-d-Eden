-- =============================================================================
-- prayer_topics — Sujets de prière (structure uniquement, module à venir)
-- =============================================================================

create table if not exists public.prayer_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority public.topic_priority not null default 'MEDIUM',
  start_date date not null default current_date,
  end_date date,
  status public.topic_status not null default 'ACTIVE',
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prayer_topics_dates_check check (end_date is null or end_date >= start_date)
);

comment on table public.prayer_topics is 'Sujets de prière suivis par la communauté.';

create index if not exists prayer_topics_status_idx on public.prayer_topics (status);
create index if not exists prayer_topics_priority_idx on public.prayer_topics (priority);
create index if not exists prayer_topics_created_by_idx on public.prayer_topics (created_by);

drop trigger if exists prayer_topics_set_updated_at on public.prayer_topics;
create trigger prayer_topics_set_updated_at
  before update on public.prayer_topics
  for each row execute function public.set_updated_at();
