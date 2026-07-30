-- =============================================================================
-- Câblage des notifications réelles — jusqu'ici `NotificationService.notify()`
-- n'était appelé nulle part (voir NOTIFICATIONS.md/ROADMAP.md « reste à
-- faire ») : la cloche ne montrait que des données de seed, jamais un
-- événement réel. Ce fichier ajoute des triggers Postgres `security definer`
-- (même stratégie que `handle_new_user`) plutôt que d'appeler
-- `NotificationService.notify()` depuis le client : certains événements
-- (un conducteur qui soumet un CR → notifier l'administrateur) créeraient une
-- notification pour un utilisateur qui n'est ni soi-même ni administrateur,
-- ce que la policy RLS d'insertion refuse — un trigger `security definer`
-- contourne cette limite proprement, et capture aussi les mutations qui ne
-- passeraient pas par un hook React (ex. `db:seed`, SQL manuel).
--
-- Sujets de prière volontairement absents ici : un nouveau sujet n'a pas de
-- destinataire personnel évident (ce serait une diffusion à tous les
-- utilisateurs) — laissé pour une itération dédiée si le besoin se confirme.
-- =============================================================================

create or replace function public.create_notification(
  p_user_id uuid,
  p_type public.notification_type,
  p_priority public.notification_priority,
  p_title text,
  p_message text,
  p_action_url text
) returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, priority, title, message, action_url)
  values (p_user_id, p_type, p_priority, p_title, p_message, p_action_url);
end;
$$;

create or replace function public.notify_admins(
  p_type public.notification_type,
  p_priority public.notification_priority,
  p_title text,
  p_message text,
  p_action_url text
) returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, priority, title, message, action_url)
  select id, p_type, p_priority, p_title, p_message, p_action_url
  from public.profiles
  where role = 'ADMIN' and is_active = true;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles — nouvelle demande d'adhésion (→ admins) et décision (→ demandeur)
-- -----------------------------------------------------------------------------

create or replace function public.notify_new_membership_request()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'PENDING' then
    perform public.notify_admins(
      'MEMBER', 'NORMAL',
      'Nouvelle demande d''adhésion',
      new.firstname || ' ' || new.lastname || ' a demandé à rejoindre les conducteurs de prière.',
      '/administration/membres/demandes'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_notify_new_request on public.profiles;
create trigger profiles_notify_new_request
  after insert on public.profiles
  for each row execute function public.notify_new_membership_request();

create or replace function public.notify_membership_decision()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.status = 'PENDING' and new.status = 'ACTIVE' then
    perform public.create_notification(
      new.id, 'MEMBER', 'NORMAL',
      'Demande acceptée',
      'Votre demande d''adhésion a été acceptée. Bienvenue !',
      '/mon-profil'
    );
  elsif old.status = 'PENDING' and new.status = 'REFUSED' then
    perform public.create_notification(
      new.id, 'MEMBER', 'NORMAL',
      'Demande refusée',
      'Votre demande d''adhésion n''a pas été acceptée.',
      null
    );
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_notify_decision on public.profiles;
create trigger profiles_notify_decision
  after update of status on public.profiles
  for each row execute function public.notify_membership_decision();

-- -----------------------------------------------------------------------------
-- reports — soumission (→ admins) et décision (→ auteur)
-- -----------------------------------------------------------------------------

create or replace function public.notify_report_events()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'SUBMITTED' and old.status is distinct from 'SUBMITTED' then
    perform public.notify_admins(
      'REPORT', 'NORMAL',
      'Compte rendu à valider',
      'Un compte rendu vient d''être soumis et attend votre validation.',
      '/comptes-rendus/' || new.id
    );
  elsif new.status = 'VALIDATED' and old.status = 'SUBMITTED' then
    perform public.create_notification(
      new.created_by, 'REPORT', 'NORMAL',
      'Compte rendu validé',
      'Votre compte rendu a été validé.',
      '/comptes-rendus/' || new.id
    );
  elsif new.status = 'REJECTED' and old.status = 'SUBMITTED' then
    perform public.create_notification(
      new.created_by, 'REPORT', 'HIGH',
      'Compte rendu refusé',
      'Votre compte rendu a été refusé — consultez les commentaires.',
      '/comptes-rendus/' || new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists reports_notify_events on public.reports;
create trigger reports_notify_events
  after update of status on public.reports
  for each row execute function public.notify_report_events();

-- -----------------------------------------------------------------------------
-- planning — assignation, modification d'horaire, annulation (→ conducteurs)
-- -----------------------------------------------------------------------------

create or replace function public.notify_planning_assignment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    if new.prayer_leader_id is not null then
      perform public.create_notification(
        new.prayer_leader_id, 'PLANNING', 'NORMAL',
        'Nouveau créneau assigné',
        'Vous avez été assigné au créneau « ' || new.title || ' ».',
        '/planning'
      );
    end if;
    if new.secondary_leader_id is not null then
      perform public.create_notification(
        new.secondary_leader_id, 'PLANNING', 'NORMAL',
        'Nouveau créneau assigné',
        'Vous avez été assigné comme conducteur secondaire du créneau « ' || new.title || ' ».',
        '/planning'
      );
    end if;
    return new;
  end if;

  -- TG_OP = 'UPDATE'
  if new.prayer_leader_id is distinct from old.prayer_leader_id and new.prayer_leader_id is not null then
    perform public.create_notification(
      new.prayer_leader_id, 'PLANNING', 'NORMAL',
      'Créneau assigné',
      'Vous avez été assigné au créneau « ' || new.title || ' ».',
      '/planning'
    );
  end if;
  if new.secondary_leader_id is distinct from old.secondary_leader_id and new.secondary_leader_id is not null then
    perform public.create_notification(
      new.secondary_leader_id, 'PLANNING', 'NORMAL',
      'Créneau assigné',
      'Vous avez été assigné comme conducteur secondaire du créneau « ' || new.title || ' ».',
      '/planning'
    );
  end if;
  if new.prayer_leader_id is not null and new.prayer_leader_id = old.prayer_leader_id
     and (new.slot_date is distinct from old.slot_date
          or new.start_time is distinct from old.start_time
          or new.end_time is distinct from old.end_time) then
    perform public.create_notification(
      new.prayer_leader_id, 'PLANNING', 'HIGH',
      'Créneau modifié',
      'L''horaire du créneau « ' || new.title || ' » a changé.',
      '/planning'
    );
  end if;
  if new.status = 'CANCELLED' and old.status is distinct from 'CANCELLED' and new.prayer_leader_id is not null then
    perform public.create_notification(
      new.prayer_leader_id, 'PLANNING', 'HIGH',
      'Créneau annulé',
      'Le créneau « ' || new.title || ' » a été annulé.',
      '/planning'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists planning_notify_assignment on public.planning;
create trigger planning_notify_assignment
  after insert or update on public.planning
  for each row execute function public.notify_planning_assignment();
