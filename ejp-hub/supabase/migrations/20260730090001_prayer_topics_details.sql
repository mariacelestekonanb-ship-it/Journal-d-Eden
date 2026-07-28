-- =============================================================================
-- prayer_topics — extension du modèle métier pour le module Sujets de prière
--
-- La migration 20260728100003 posait la structure minimale (titre, priorité,
-- dates, statut ACTIVE/ARCHIVED). Le module Sujets de prière a besoin du
-- modèle complet : catégories, priorités étendues (dont URGENT), un cycle de
-- vie à quatre statuts (DRAFT/ACTIVE/COMPLETED/ARCHIVED) et une date
-- d'archivage explicite pour l'historique.
--
-- Les enums `topic_priority` et `topic_status` d'origine sont remplacés par
-- de nouveaux types plutôt qu'étendus via `ADD VALUE`, car Postgres interdit
-- d'utiliser une valeur tout juste ajoutée dans la même transaction — ce que
-- cette migration doit faire immédiatement (colonnes par défaut, cast des
-- lignes existantes).
-- =============================================================================

do $$ begin
  create type public.prayer_topic_priority as enum ('LOW', 'NORMAL', 'HIGH', 'URGENT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.prayer_topic_status as enum ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.prayer_topic_category as enum (
    'CHURCH', 'FAMILY', 'YOUTH', 'EVANGELISM', 'HEALING', 'NATIONS', 'PERSONAL'
  );
exception when duplicate_object then null; end $$;

alter table public.prayer_topics
  add column if not exists category public.prayer_topic_category not null default 'CHURCH',
  add column if not exists archived_at timestamptz;

alter table public.prayer_topics alter column priority drop default;
alter table public.prayer_topics
  alter column priority type public.prayer_topic_priority
  using (
    case priority::text
      when 'LOW' then 'LOW'
      when 'MEDIUM' then 'NORMAL'
      when 'HIGH' then 'HIGH'
      else 'NORMAL'
    end
  )::public.prayer_topic_priority;
alter table public.prayer_topics alter column priority set default 'NORMAL';

alter table public.prayer_topics alter column status drop default;
alter table public.prayer_topics
  alter column status type public.prayer_topic_status
  using (
    case status::text
      when 'ACTIVE' then 'ACTIVE'
      when 'ARCHIVED' then 'ARCHIVED'
      else 'ACTIVE'
    end
  )::public.prayer_topic_status;
alter table public.prayer_topics alter column status set default 'DRAFT';

-- Les lignes déjà marquées ARCHIVED n'avaient pas de date d'archivage : on
-- retient `updated_at` comme meilleure approximation disponible.
update public.prayer_topics set archived_at = updated_at where status = 'ARCHIVED' and archived_at is null;

drop type if exists public.topic_priority;
drop type if exists public.topic_status;

comment on column public.prayer_topics.category is
  'Catégorie du sujet (Église, Famille, Jeunesse, Évangélisation, Guérison, Nations, Personnel).';
comment on column public.prayer_topics.archived_at is
  'Date d''archivage — renseignée automatiquement lors du passage au statut ARCHIVED.';

create index if not exists prayer_topics_category_idx on public.prayer_topics (category);
create index if not exists prayer_topics_archived_at_idx on public.prayer_topics (archived_at);
