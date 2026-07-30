-- =============================================================================
-- Un conducteur (principal ou secondaire) peut désormais accepter ou refuser
-- un créneau qui lui est assigné, avec un commentaire, revenir sur sa
-- décision, et signaler un remplacement en proposant un membre précis —
-- soumis à validation d'un administrateur.
-- =============================================================================

do $$ begin
  create type public.assignment_response as enum ('PENDING', 'ACCEPTED', 'DECLINED');
exception when duplicate_object then null; end $$;

alter table public.planning
  add column if not exists prayer_leader_response public.assignment_response not null default 'PENDING',
  add column if not exists prayer_leader_response_comment text,
  add column if not exists prayer_leader_response_at timestamptz,
  add column if not exists secondary_leader_response public.assignment_response not null default 'PENDING',
  add column if not exists secondary_leader_response_comment text,
  add column if not exists secondary_leader_response_at timestamptz;

comment on column public.planning.prayer_leader_response is
  'Réponse du conducteur principal à son assignation — remise à PENDING dès que prayer_leader_id change.';
comment on column public.planning.secondary_leader_response is
  'Réponse du conducteur secondaire à son assignation — remise à PENDING dès que secondary_leader_id change.';

-- -----------------------------------------------------------------------------
-- RLS : un conducteur assigné (principal ou secondaire) peut mettre à jour sa
-- ligne — la restriction aux seules colonnes de réponse est appliquée par le
-- trigger ci-dessous (`planning_admin_update` couvre déjà l'accès admin).
-- -----------------------------------------------------------------------------

drop policy if exists "planning_leader_response_update" on public.planning;
create policy "planning_leader_response_update" on public.planning
  for update
  using (auth.uid() = prayer_leader_id or auth.uid() = secondary_leader_id)
  with check (auth.uid() = prayer_leader_id or auth.uid() = secondary_leader_id);

-- -----------------------------------------------------------------------------
-- Avant écriture : réinitialise la réponse quand le conducteur change,
-- horodate automatiquement toute nouvelle réponse, et empêche un conducteur
-- non-admin de modifier autre chose que sa propre réponse.
-- -----------------------------------------------------------------------------

create or replace function public.manage_planning_assignment_response()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    new.prayer_leader_response := 'PENDING';
    new.prayer_leader_response_comment := null;
    new.prayer_leader_response_at := null;
    new.secondary_leader_response := 'PENDING';
    new.secondary_leader_response_comment := null;
    new.secondary_leader_response_at := null;
    return new;
  end if;

  if not public.is_admin() then
    if auth.uid() is distinct from old.prayer_leader_id and auth.uid() is distinct from old.secondary_leader_id then
      raise exception 'Non autorisé.';
    end if;

    if new.slot_date is distinct from old.slot_date
       or new.start_time is distinct from old.start_time
       or new.end_time is distinct from old.end_time
       or new.title is distinct from old.title
       or new.description is distinct from old.description
       or new.prayer_leader_id is distinct from old.prayer_leader_id
       or new.secondary_leader_id is distinct from old.secondary_leader_id
       or new.theme is distinct from old.theme
       or new.status is distinct from old.status
       or new.prayer_topic_id is distinct from old.prayer_topic_id
       or new.program_id is distinct from old.program_id
       or new.location is distinct from old.location
       or new.notes is distinct from old.notes then
      raise exception 'Vous ne pouvez modifier que votre réponse à ce créneau.';
    end if;

    if auth.uid() is distinct from old.prayer_leader_id
       and (new.prayer_leader_response is distinct from old.prayer_leader_response
            or new.prayer_leader_response_comment is distinct from old.prayer_leader_response_comment) then
      raise exception 'Vous ne pouvez modifier que votre propre réponse.';
    end if;

    if auth.uid() is distinct from old.secondary_leader_id
       and (new.secondary_leader_response is distinct from old.secondary_leader_response
            or new.secondary_leader_response_comment is distinct from old.secondary_leader_response_comment) then
      raise exception 'Vous ne pouvez modifier que votre propre réponse.';
    end if;
  end if;

  if new.prayer_leader_id is distinct from old.prayer_leader_id then
    new.prayer_leader_response := 'PENDING';
    new.prayer_leader_response_comment := null;
    new.prayer_leader_response_at := null;
  elsif new.prayer_leader_response is distinct from old.prayer_leader_response then
    new.prayer_leader_response_at := now();
  end if;

  if new.secondary_leader_id is distinct from old.secondary_leader_id then
    new.secondary_leader_response := 'PENDING';
    new.secondary_leader_response_comment := null;
    new.secondary_leader_response_at := null;
  elsif new.secondary_leader_response is distinct from old.secondary_leader_response then
    new.secondary_leader_response_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists planning_manage_assignment_response on public.planning;
create trigger planning_manage_assignment_response
  before insert or update on public.planning
  for each row execute function public.manage_planning_assignment_response();

-- -----------------------------------------------------------------------------
-- Notifie les administrateurs quand un conducteur répond (accepte/refuse).
-- -----------------------------------------------------------------------------

create or replace function public.notify_planning_response()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  leader_name text;
  action_label text;
begin
  if new.prayer_leader_response is distinct from old.prayer_leader_response and new.prayer_leader_response <> 'PENDING' then
    select firstname || ' ' || lastname into leader_name from public.profiles where id = new.prayer_leader_id;
    action_label := case when new.prayer_leader_response = 'ACCEPTED' then 'accepté' else 'refusé' end;
    perform public.notify_admins(
      'PLANNING', (case when new.prayer_leader_response = 'DECLINED' then 'HIGH' else 'LOW' end)::public.notification_priority,
      'Réponse à une assignation',
      coalesce(leader_name, 'Le conducteur') || ' a ' || action_label || ' le créneau « ' || new.title || ' »'
        || case when new.prayer_leader_response_comment is not null and new.prayer_leader_response_comment <> ''
                then ' : ' || new.prayer_leader_response_comment else '.' end,
      '/planning'
    );
  end if;

  if new.secondary_leader_response is distinct from old.secondary_leader_response and new.secondary_leader_response <> 'PENDING' then
    select firstname || ' ' || lastname into leader_name from public.profiles where id = new.secondary_leader_id;
    action_label := case when new.secondary_leader_response = 'ACCEPTED' then 'accepté' else 'refusé' end;
    perform public.notify_admins(
      'PLANNING', (case when new.secondary_leader_response = 'DECLINED' then 'HIGH' else 'LOW' end)::public.notification_priority,
      'Réponse à une assignation',
      coalesce(leader_name, 'Le conducteur secondaire') || ' a ' || action_label
        || ' le créneau « ' || new.title || ' » (secondaire)'
        || case when new.secondary_leader_response_comment is not null and new.secondary_leader_response_comment <> ''
                then ' : ' || new.secondary_leader_response_comment else '.' end,
      '/planning'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists planning_notify_response on public.planning;
create trigger planning_notify_response
  after update on public.planning
  for each row execute function public.notify_planning_response();

-- =============================================================================
-- Demandes de remplacement : un conducteur assigné propose un membre précis
-- pour le remplacer sur un créneau — un administrateur approuve ou refuse.
-- =============================================================================

do $$ begin
  create type public.replacement_request_status as enum ('PENDING', 'APPROVED', 'REJECTED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.planning_leader_role as enum ('PRAYER_LEADER', 'SECONDARY_LEADER');
exception when duplicate_object then null; end $$;

create table if not exists public.planning_replacement_requests (
  id uuid primary key default gen_random_uuid(),
  planning_id uuid not null references public.planning (id) on delete cascade,
  role public.planning_leader_role not null,
  requested_by uuid not null references public.profiles (id),
  proposed_member_id uuid not null references public.profiles (id),
  comment text,
  status public.replacement_request_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles (id)
);

comment on table public.planning_replacement_requests is
  'Demande de remplacement proposée par un conducteur assigné (principal ou secondaire), à valider par un admin.';

create index if not exists planning_replacement_requests_planning_idx
  on public.planning_replacement_requests (planning_id);
create index if not exists planning_replacement_requests_status_idx
  on public.planning_replacement_requests (status);

alter table public.planning_replacement_requests enable row level security;

drop policy if exists "replacement_requests_select" on public.planning_replacement_requests;
create policy "replacement_requests_select" on public.planning_replacement_requests
  for select using (
    public.is_admin() or requested_by = auth.uid() or proposed_member_id = auth.uid()
  );

drop policy if exists "replacement_requests_insert" on public.planning_replacement_requests;
create policy "replacement_requests_insert" on public.planning_replacement_requests
  for insert with check (
    requested_by = auth.uid()
    and exists (
      select 1 from public.planning p
      where p.id = planning_id
        and (p.prayer_leader_id = auth.uid() or p.secondary_leader_id = auth.uid())
    )
  );

drop policy if exists "replacement_requests_admin_update" on public.planning_replacement_requests;
create policy "replacement_requests_admin_update" on public.planning_replacement_requests
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "replacement_requests_cancel_own" on public.planning_replacement_requests;
create policy "replacement_requests_cancel_own" on public.planning_replacement_requests
  for delete using (requested_by = auth.uid() and status = 'PENDING');

drop policy if exists "replacement_requests_admin_delete" on public.planning_replacement_requests;
create policy "replacement_requests_admin_delete" on public.planning_replacement_requests
  for delete using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Notifie les administrateurs à la création d'une demande de remplacement.
-- -----------------------------------------------------------------------------

create or replace function public.notify_replacement_request()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requester_name text;
  proposed_name text;
  slot_title text;
begin
  select firstname || ' ' || lastname into requester_name from public.profiles where id = new.requested_by;
  select firstname || ' ' || lastname into proposed_name from public.profiles where id = new.proposed_member_id;
  select title into slot_title from public.planning where id = new.planning_id;

  perform public.notify_admins(
    'PLANNING', 'HIGH',
    'Demande de remplacement',
    coalesce(requester_name, 'Un conducteur') || ' propose ' || coalesce(proposed_name, 'un remplaçant')
      || ' pour le créneau « ' || coalesce(slot_title, '') || ' »'
      || case when new.comment is not null and new.comment <> '' then ' : ' || new.comment else '.' end,
    '/planning'
  );
  return new;
end;
$$;

drop trigger if exists replacement_requests_notify on public.planning_replacement_requests;
create trigger replacement_requests_notify
  after insert on public.planning_replacement_requests
  for each row execute function public.notify_replacement_request();

-- -----------------------------------------------------------------------------
-- Décision admin : si approuvée, réassigne réellement le créneau (ce qui
-- déclenche à son tour la notification d'assignation existante et la remise
-- à zéro de la réponse) ; notifie le demandeur dans tous les cas.
-- -----------------------------------------------------------------------------

create or replace function public.notify_replacement_decision()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  slot_title text;
begin
  if new.status is distinct from old.status and new.status in ('APPROVED', 'REJECTED') then
    select title into slot_title from public.planning where id = new.planning_id;

    if new.status = 'APPROVED' then
      if new.role = 'PRAYER_LEADER' then
        update public.planning set prayer_leader_id = new.proposed_member_id where id = new.planning_id;
      else
        update public.planning set secondary_leader_id = new.proposed_member_id where id = new.planning_id;
      end if;
    end if;

    perform public.create_notification(
      new.requested_by, 'PLANNING', (case when new.status = 'APPROVED' then 'NORMAL' else 'HIGH' end)::public.notification_priority,
      case when new.status = 'APPROVED' then 'Remplacement accepté' else 'Remplacement refusé' end,
      case when new.status = 'APPROVED'
           then 'Votre demande de remplacement pour « ' || coalesce(slot_title, '') || ' » a été acceptée.'
           else 'Votre demande de remplacement pour « ' || coalesce(slot_title, '') || ' » a été refusée.' end,
      '/planning'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists replacement_requests_notify_decision on public.planning_replacement_requests;
create trigger replacement_requests_notify_decision
  after update on public.planning_replacement_requests
  for each row execute function public.notify_replacement_decision();
