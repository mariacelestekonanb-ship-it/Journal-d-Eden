-- =============================================================================
-- testimonies — Témoignages (structure uniquement, module à venir)
-- =============================================================================

create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.testimonies is 'Témoignages publiés par les conducteurs de prière.';

create index if not exists testimonies_author_idx on public.testimonies (author_id);
create index if not exists testimonies_created_at_idx on public.testimonies (created_at desc);

drop trigger if exists testimonies_set_updated_at on public.testimonies;
create trigger testimonies_set_updated_at
  before update on public.testimonies
  for each row execute function public.set_updated_at();
