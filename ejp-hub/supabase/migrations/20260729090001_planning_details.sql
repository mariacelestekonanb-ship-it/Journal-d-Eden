-- =============================================================================
-- planning — extension du modèle métier pour le module Planning
--
-- La migration 20260728100004 posait la structure minimale (créneau, lieu,
-- conducteur, sujet). Le module Planning (moteur de planification central
-- d'EJP Hub) a besoin du modèle complet : titre, description, conducteur
-- secondaire, thème libre et statut de cycle de vie.
-- =============================================================================

do $$ begin
  create type public.planning_status as enum ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
exception when duplicate_object then null; end $$;

alter table public.planning
  add column if not exists title text not null default 'Temps de prière',
  add column if not exists description text,
  add column if not exists secondary_leader_id uuid references public.profiles (id),
  add column if not exists theme text,
  add column if not exists status public.planning_status not null default 'DRAFT';

-- La valeur par défaut de `title` n'existe que pour rendre la migration
-- rejouable sur une table déjà peuplée sans échouer sur la contrainte
-- `not null` ; les nouveaux créneaux doivent toujours fournir un titre
-- explicite via le formulaire (validation Zod côté application).
alter table public.planning alter column title drop default;

comment on column public.planning.secondary_leader_id is
  'Conducteur secondaire, optionnel — ne doit pas être identique à prayer_leader_id (vérifié côté application).';
comment on column public.planning.theme is
  'Thème libre du créneau (ex. « Louange », « Intercession »), distinct du sujet de prière structuré (prayer_topic_id).';

create index if not exists planning_status_idx on public.planning (status);
create index if not exists planning_secondary_leader_idx on public.planning (secondary_leader_id);
