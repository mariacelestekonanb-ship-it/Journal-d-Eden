-- =============================================================================
-- Complète le trigger d'assignation d'un créneau : l'administrateur est
-- désormais aussi notifié (pas seulement le conducteur), et le message du
-- conducteur rappelle explicitement de remplir le compte rendu ensuite.
--
-- Ajoute surtout une relance récurrente (pg_cron, quotidienne) : tant qu'un
-- créneau passé n'a pas de compte rendu, son conducteur reçoit un rappel
-- chaque jour — pas seulement au moment de l'assignation, qui peut avoir eu
-- lieu plusieurs jours avant que le créneau n'ait réellement lieu.
-- =============================================================================

create or replace function public.notify_planning_assignment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  leader_name text;
begin
  if TG_OP = 'INSERT' then
    if new.prayer_leader_id is not null then
      perform public.create_notification(
        new.prayer_leader_id, 'PLANNING', 'NORMAL',
        'Nouveau créneau assigné',
        'Vous avez été assigné au créneau « ' || new.title
          || ' ». Pensez à remplir le compte rendu une fois la prière terminée.',
        '/planning'
      );

      select firstname || ' ' || lastname into leader_name
      from public.profiles where id = new.prayer_leader_id;

      perform public.notify_admins(
        'PLANNING', 'LOW',
        'Conducteur assigné',
        coalesce(leader_name, 'Un conducteur') || ' a été assigné au créneau « ' || new.title || ' ».',
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
      'Vous avez été assigné au créneau « ' || new.title
        || ' ». Pensez à remplir le compte rendu une fois la prière terminée.',
      '/planning'
    );

    select firstname || ' ' || lastname into leader_name
    from public.profiles where id = new.prayer_leader_id;

    perform public.notify_admins(
      'PLANNING', 'LOW',
      'Conducteur assigné',
      coalesce(leader_name, 'Un conducteur') || ' a été assigné au créneau « ' || new.title || ' ».',
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

-- -----------------------------------------------------------------------------
-- Relance quotidienne des comptes rendus manquants (créneaux passés, non annulés).
-- -----------------------------------------------------------------------------

create extension if not exists pg_cron;

create or replace function public.send_report_reminders()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  slot record;
  already_sent_today boolean;
begin
  for slot in
    select p.id, p.title, p.prayer_leader_id, p.slot_date
    from public.planning p
    where p.slot_date < current_date
      and p.prayer_leader_id is not null
      and p.status <> 'CANCELLED'
      and not exists (select 1 from public.reports r where r.planning_id = p.id)
  loop
    select exists (
      select 1 from public.notifications n
      where n.user_id = slot.prayer_leader_id
        and n.title = 'Compte rendu à remplir'
        and n.message like '%« ' || slot.title || ' %'
        and n.created_at::date = current_date
    ) into already_sent_today;

    if not already_sent_today then
      perform public.create_notification(
        slot.prayer_leader_id, 'REPORT', 'HIGH',
        'Compte rendu à remplir',
        'Le créneau « ' || slot.title || ' » du ' || to_char(slot.slot_date, 'DD/MM/YYYY')
          || ' attend toujours son compte rendu.',
        '/comptes-rendus/nouveau'
      );
    end if;
  end loop;
end;
$$;

select cron.schedule(
  'send-report-reminders',
  '0 8 * * *',
  $$select public.send_report_reminders();$$
);
