-- =============================================================================
-- programs — regroupements de créneaux (ex. « Programme Jeunesse »), avec une
-- équipe de conducteurs dédiée. Un créneau appartient à zéro ou un programme
-- (planning général si aucun) ; un membre peut appartenir à plusieurs
-- programmes (table de jointure `program_members`), assigné explicitement par
-- un administrateur — pas de déduction automatique depuis les créneaux.
-- =============================================================================

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.programs is
  'Un programme de prière (ex. « Programme Jeunesse ») regroupant certains créneaux et une équipe de conducteurs dédiée.';

create table if not exists public.program_members (
  program_id uuid not null references public.programs (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (program_id, member_id)
);

comment on table public.program_members is
  'Appartenance d''un membre à un programme — assignée par un administrateur, plusieurs programmes possibles par membre.';

alter table public.planning
  add column if not exists program_id uuid references public.programs (id) on delete set null;

comment on column public.planning.program_id is
  'Programme auquel ce créneau appartient — optionnel, absent pour un créneau du planning général.';

create index if not exists planning_program_id_idx on public.planning (program_id);
create index if not exists program_members_member_id_idx on public.program_members (member_id);

-- -----------------------------------------------------------------------------
-- RLS — lecture pour tout utilisateur connecté, écriture admin (même
-- répartition que prayer_topics/planning, voir 20260728100008).
-- -----------------------------------------------------------------------------

alter table public.programs enable row level security;
alter table public.program_members enable row level security;

drop policy if exists "programs_select" on public.programs;
create policy "programs_select" on public.programs
  for select using (auth.uid() is not null);

drop policy if exists "programs_admin_insert" on public.programs;
create policy "programs_admin_insert" on public.programs
  for insert with check (public.is_admin());

drop policy if exists "programs_admin_update" on public.programs;
create policy "programs_admin_update" on public.programs
  for update using (public.is_admin());

drop policy if exists "programs_admin_delete" on public.programs;
create policy "programs_admin_delete" on public.programs
  for delete using (public.is_admin());

drop policy if exists "program_members_select" on public.program_members;
create policy "program_members_select" on public.program_members
  for select using (auth.uid() is not null);

drop policy if exists "program_members_admin_insert" on public.program_members;
create policy "program_members_admin_insert" on public.program_members
  for insert with check (public.is_admin());

drop policy if exists "program_members_admin_delete" on public.program_members;
create policy "program_members_admin_delete" on public.program_members
  for delete using (public.is_admin());
