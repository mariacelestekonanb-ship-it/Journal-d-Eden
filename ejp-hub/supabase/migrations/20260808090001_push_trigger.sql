-- =============================================================================
-- Déclenche l'envoi d'une notification push à chaque nouvelle ligne de
-- `notifications`. Passe par `pg_net` directement (fonction `net.http_post`)
-- plutôt que par la fonctionnalité « Database Webhooks » du tableau de bord
-- Supabase : celle-ci dépend du schéma interne `supabase_functions`, absent
-- sur ce projet (« schema "supabase_functions" does not exist » lors de la
-- création via l'interface) — `pg_net` est l'extension sous-jacente
-- utilisée par cette fonctionnalité, disponible indépendamment d'elle.
--
-- ⚠️ L'URL et le secret sont en dur ci-dessous : si le domaine change un
-- jour (nouveau projet Vercel) ou si le secret est régénéré, cette fonction
-- doit être recréée avec les nouvelles valeurs (voir NOTIFICATIONS.md#push).
-- =============================================================================

create extension if not exists pg_net;

create or replace function public.trigger_push_notification()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://ejp-tau.vercel.app/api/push/send',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', '4b47ac4a54fd175a83c3c439b94fc7ef5b510258b4da6ac7f7546f38b5440bc5'
    ),
    body := jsonb_build_object('record', jsonb_build_object(
      'id', new.id,
      'user_id', new.user_id,
      'title', new.title,
      'message', new.message,
      'action_url', new.action_url,
      'priority', new.priority
    ))
  );
  return new;
end;
$$;

drop trigger if exists notifications_trigger_push on public.notifications;
create trigger notifications_trigger_push
  after insert on public.notifications
  for each row execute function public.trigger_push_notification();
