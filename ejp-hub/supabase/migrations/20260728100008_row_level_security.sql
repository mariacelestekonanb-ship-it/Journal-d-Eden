-- =============================================================================
-- Row Level Security — activée sur toutes les tables dès leur création,
-- même si elles sont encore vides côté application.
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.prayer_topics enable row level security;
alter table public.planning enable row level security;
alter table public.reports enable row level security;
alter table public.testimonies enable row level security;
alter table public.notifications enable row level security;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert" on public.profiles
  for insert with check (public.is_admin() or auth.uid() = id);

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete" on public.profiles
  for delete using (public.is_admin());

-- -----------------------------------------------------------------------------
-- prayer_topics — lecture pour tout utilisateur connecté, écriture admin
-- -----------------------------------------------------------------------------
drop policy if exists "prayer_topics_select" on public.prayer_topics;
create policy "prayer_topics_select" on public.prayer_topics
  for select using (auth.uid() is not null);

drop policy if exists "prayer_topics_admin_insert" on public.prayer_topics;
create policy "prayer_topics_admin_insert" on public.prayer_topics
  for insert with check (public.is_admin());

drop policy if exists "prayer_topics_admin_update" on public.prayer_topics;
create policy "prayer_topics_admin_update" on public.prayer_topics
  for update using (public.is_admin());

drop policy if exists "prayer_topics_admin_delete" on public.prayer_topics;
create policy "prayer_topics_admin_delete" on public.prayer_topics
  for delete using (public.is_admin());

-- -----------------------------------------------------------------------------
-- planning — lecture pour tout utilisateur connecté, écriture admin
-- -----------------------------------------------------------------------------
drop policy if exists "planning_select" on public.planning;
create policy "planning_select" on public.planning
  for select using (auth.uid() is not null);

drop policy if exists "planning_admin_insert" on public.planning;
create policy "planning_admin_insert" on public.planning
  for insert with check (public.is_admin());

drop policy if exists "planning_admin_update" on public.planning;
create policy "planning_admin_update" on public.planning
  for update using (public.is_admin());

drop policy if exists "planning_admin_delete" on public.planning;
create policy "planning_admin_delete" on public.planning
  for delete using (public.is_admin());

-- -----------------------------------------------------------------------------
-- reports — un conducteur ne voit / modifie que son propre CR ; admin voit tout
-- -----------------------------------------------------------------------------
drop policy if exists "reports_select" on public.reports;
create policy "reports_select" on public.reports
  for select using (auth.uid() = prayer_leader_id or public.is_admin());

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert with check (
    auth.uid() = prayer_leader_id
    and exists (
      select 1 from public.planning p
      where p.id = planning_id and p.prayer_leader_id = auth.uid()
    )
  );

drop policy if exists "reports_update_own_or_admin" on public.reports;
create policy "reports_update_own_or_admin" on public.reports
  for update using (auth.uid() = prayer_leader_id or public.is_admin());

drop policy if exists "reports_delete_admin" on public.reports;
create policy "reports_delete_admin" on public.reports
  for delete using (public.is_admin());

-- -----------------------------------------------------------------------------
-- testimonies — tout utilisateur connecté publie, seul l'admin supprime
-- -----------------------------------------------------------------------------
drop policy if exists "testimonies_select" on public.testimonies;
create policy "testimonies_select" on public.testimonies
  for select using (auth.uid() is not null);

drop policy if exists "testimonies_insert_own" on public.testimonies;
create policy "testimonies_insert_own" on public.testimonies
  for insert with check (auth.uid() = author_id);

drop policy if exists "testimonies_update_own_or_admin" on public.testimonies;
create policy "testimonies_update_own_or_admin" on public.testimonies
  for update using (auth.uid() = author_id or public.is_admin());

drop policy if exists "testimonies_delete_admin_only" on public.testimonies;
create policy "testimonies_delete_admin_only" on public.testimonies
  for delete using (public.is_admin());

-- -----------------------------------------------------------------------------
-- notifications — chacun ne voit / ne modifie que les siennes
-- -----------------------------------------------------------------------------
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);
