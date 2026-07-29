-- =============================================================================
-- notifications — modèle métier complet du module Notifications
--
-- La migration 20260728100007 posait la structure minimale (type, titre,
-- message, lien, lu/non lu) sans qu'aucun module ne l'utilise encore. Le
-- module Notifications a besoin d'une priorité, d'une catégorisation par
-- type élargie à tous les modules producteurs d'événements (Planning,
-- Comptes rendus, Membres, Sujets de prière, Système) et des policies RLS
-- d'écriture qui manquaient — jusqu'ici aucune requête ne pouvait créer ni
-- supprimer une notification, seule la lecture et le marquage lu/non lu
-- étaient possibles.
-- =============================================================================

do $$ begin
  create type public.notification_priority as enum ('LOW', 'NORMAL', 'HIGH', 'URGENT');
exception when duplicate_object then null; end $$;

-- Remplace `notification_type` (UPCOMING_SLOT/PENDING_REPORT/NEW_TOPIC) par un
-- type élargi à un préfixe par module producteur plutôt qu'un événement précis
-- par valeur — un enum par événement exact (ex. `REPORT_VALIDATED`) grossirait
-- indéfiniment à chaque nouvelle notification, alors que le module producteur
-- ne change presque jamais. `title`/`message` portent déjà le détail de
-- l'événement. Remplacé plutôt qu'étendu via `ADD VALUE` pour la même raison
-- que `prayer_topic_priority`/`prayer_topic_status` (20260730090001) :
-- Postgres interdit d'utiliser une valeur tout juste ajoutée dans la même
-- transaction que celle qui doit l'exploiter (cast des lignes existantes).
do $$ begin
  create type public.notification_type_v2 as enum ('PLANNING', 'REPORT', 'MEMBER', 'PRAYER_TOPIC', 'SYSTEM');
exception when duplicate_object then null; end $$;

alter table public.notifications
  add column if not exists priority public.notification_priority not null default 'NORMAL';

alter table public.notifications
  alter column type type public.notification_type_v2
  using (
    case type::text
      when 'UPCOMING_SLOT' then 'PLANNING'
      when 'PENDING_REPORT' then 'REPORT'
      when 'NEW_TOPIC' then 'PRAYER_TOPIC'
      else 'SYSTEM'
    end
  )::public.notification_type_v2;

drop type if exists public.notification_type;
alter type public.notification_type_v2 rename to notification_type;

do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'notifications' and column_name = 'link'
  ) then
    alter table public.notifications rename column link to action_url;
  end if;
end $$;

create index if not exists notifications_type_idx on public.notifications (type);
create index if not exists notifications_priority_idx on public.notifications (priority);

comment on column public.notifications.priority is
  'Priorité d''affichage — LOW | NORMAL | HIGH | URGENT, défaut NORMAL.';
comment on column public.notifications.type is
  'Module producteur de l''événement : PLANNING | REPORT | MEMBER | PRAYER_TOPIC | SYSTEM.';
comment on column public.notifications.action_url is
  'Lien vers l''élément concerné (créneau, compte rendu, membre, sujet…) — ouvert par l''action « Consulter ».';

-- Écriture : chacun peut créer une notification pour lui-même (rappels
-- personnels), un admin peut en créer pour n'importe qui (diffusion
-- système, notifications ciblées) — couvre les cas déjà réels sans policy
-- trop permissive. La création croisée automatique (ex. un conducteur
-- soumet un CR → notifier l'admin) nécessitera un trigger `security definer`
-- sur la table source ou un appel via la clé de service, pas cette policy —
-- voir NOTIFICATIONS.md.
drop policy if exists "notifications_insert_self_or_admin" on public.notifications;
create policy "notifications_insert_self_or_admin" on public.notifications
  for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own" on public.notifications
  for delete using (auth.uid() = user_id);
