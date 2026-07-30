-- =============================================================================
-- Rappel automatique (pg_cron, quotidien) aux conducteurs — principal et
-- secondaire — qu'ils conduisent la prière la veille et le jour même d'un
-- créneau. Complète `send_report_reminders` (qui rappelle un compte rendu
-- manquant *après* le créneau) par un rappel *avant* qu'il n'ait lieu.
-- =============================================================================

create extension if not exists pg_cron;

create or replace function public.send_upcoming_slot_reminders()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  slot record;
  leader_id uuid;
  label text;
  already_sent boolean;
begin
  for slot in
    select id, title, start_time, slot_date, prayer_leader_id, secondary_leader_id
    from public.planning
    where slot_date in (current_date, current_date + 1)
      and status <> 'CANCELLED'
  loop
    label := case when slot.slot_date = current_date then 'aujourd''hui' else 'demain' end;

    foreach leader_id in array array_remove(
      array[slot.prayer_leader_id, slot.secondary_leader_id]::uuid[], null
    )
    loop
      select exists (
        select 1 from public.notifications n
        where n.user_id = leader_id
          and n.title = 'Rappel : vous conduisez la prière'
          and n.message like '%« ' || slot.title || ' %'
          and n.created_at::date = current_date
      ) into already_sent;

      if not already_sent then
        perform public.create_notification(
          leader_id, 'PLANNING',
          (case when label = 'aujourd''hui' then 'HIGH' else 'NORMAL' end)::public.notification_priority,
          'Rappel : vous conduisez la prière',
          'Vous conduisez la prière « ' || slot.title || ' » ' || label
            || ' à ' || to_char(slot.start_time, 'HH24:MI') || '.',
          '/planning'
        );
      end if;
    end loop;
  end loop;
end;
$$;

select cron.schedule(
  'send-upcoming-slot-reminders',
  '0 7 * * *',
  $$select public.send_upcoming_slot_reminders();$$
);
