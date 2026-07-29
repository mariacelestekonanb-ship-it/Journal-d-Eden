-- =============================================================================
-- Module Administration — paramètres généraux, catégories configurables et
-- journal d'administration.
--
-- Ces trois tables sont entièrement nouvelles et n'appartiennent à aucun
-- module existant : `app_settings` (ligne unique), `admin_categories`
-- (listes configurables par module) et `admin_audit_log` (historique des
-- actions importantes). Toutes réservées aux administrateurs — RLS
-- `is_admin()` sur chaque opération, aucune exception.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- app_settings — paramètres généraux de la plateforme (ligne unique)
-- -----------------------------------------------------------------------------
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  platform_name text not null default 'EJP Hub',
  logo_url text,
  description text,
  timezone text not null default 'Europe/Paris',
  language text not null default 'fr',
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

comment on table public.app_settings is
  'Paramètres généraux de la plateforme — ligne unique (voir index singleton ci-dessous). '
  'Pas encore branchée sur l''affichage réel (nom/logo du Header) — voir ADMIN.md.';

-- Empêche plus d'une ligne — technique de « table singleton » par index sur une expression constante.
create unique index if not exists app_settings_singleton_idx on public.app_settings ((true));

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

insert into public.app_settings (platform_name, description, timezone, language)
select 'EJP Hub', 'Plateforme de centralisation pour les conducteurs de prière de l''EJP.', 'Europe/Paris', 'fr'
where not exists (select 1 from public.app_settings);

alter table public.app_settings enable row level security;

drop policy if exists "app_settings_admin_all" on public.app_settings;
create policy "app_settings_admin_all" on public.app_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- admin_categories — listes configurables par module (CRUD complet)
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.admin_category_scope as enum ('PRAYER_TOPIC_CATEGORY', 'MEETING_TYPE');
exception when duplicate_object then null; end $$;

create table if not exists public.admin_categories (
  id uuid primary key default gen_random_uuid(),
  scope public.admin_category_scope not null,
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scope, value)
);

comment on table public.admin_categories is
  'Catégories configurables par module (sujets de prière, types de réunion…). CRUD réservé aux '
  'administrateurs. Le module Sujets de prière lit encore aujourd''hui son propre enum '
  '`prayer_topic_category` — câbler ces listes à sa place est documenté dans ADMIN.md, pas fait '
  'dans ce sprint (ne modifie pas le module Sujets de prière).';
comment on column public.admin_categories.scope is
  'Module concerné — extensible : ajouter une valeur à `admin_category_scope` suffit pour un futur module.';

create index if not exists admin_categories_scope_idx on public.admin_categories (scope, sort_order);

drop trigger if exists admin_categories_set_updated_at on public.admin_categories;
create trigger admin_categories_set_updated_at
  before update on public.admin_categories
  for each row execute function public.set_updated_at();

-- Seed reprenant les valeurs déjà utilisées par `prayer_topic_category`, pour que l'admin retrouve
-- immédiatement une liste cohérente avec ce qui est réellement affiché ailleurs dans l'application.
insert into public.admin_categories (scope, label, value, sort_order) values
  ('PRAYER_TOPIC_CATEGORY', 'Église', 'CHURCH', 0),
  ('PRAYER_TOPIC_CATEGORY', 'Famille', 'FAMILY', 1),
  ('PRAYER_TOPIC_CATEGORY', 'Jeunesse', 'YOUTH', 2),
  ('PRAYER_TOPIC_CATEGORY', 'Évangélisation', 'EVANGELISM', 3),
  ('PRAYER_TOPIC_CATEGORY', 'Guérison', 'HEALING', 4),
  ('PRAYER_TOPIC_CATEGORY', 'Nations', 'NATIONS', 5),
  ('PRAYER_TOPIC_CATEGORY', 'Personnel', 'PERSONAL', 6),
  ('MEETING_TYPE', 'Prière hebdomadaire', 'WEEKLY_PRAYER', 0),
  ('MEETING_TYPE', 'Veillée de prière', 'VIGIL', 1),
  ('MEETING_TYPE', 'Intercession', 'INTERCESSION', 2)
on conflict (scope, value) do nothing;

alter table public.admin_categories enable row level security;

drop policy if exists "admin_categories_admin_all" on public.admin_categories;
create policy "admin_categories_admin_all" on public.admin_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- admin_audit_log — journal des actions importantes de la plateforme
-- -----------------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  module text not null,
  target_label text,
  created_at timestamptz not null default now()
);

comment on table public.admin_audit_log is
  'Historique des actions importantes (validation d''un membre, changement de rôle, suppression, '
  'archivage, validation d''un compte rendu…). Alimenté par des données de démonstration en mode '
  'mock ; le câblage réel depuis chaque module producteur (trigger `security definer` ou appel '
  'serveur, comme pour `notifications`) est documenté dans ADMIN.md, pas fait dans ce sprint.';

create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_module_idx on public.admin_audit_log (module);

alter table public.admin_audit_log enable row level security;

drop policy if exists "admin_audit_log_select_admin" on public.admin_audit_log;
create policy "admin_audit_log_select_admin" on public.admin_audit_log
  for select using (public.is_admin());

drop policy if exists "admin_audit_log_insert_admin" on public.admin_audit_log;
create policy "admin_audit_log_insert_admin" on public.admin_audit_log
  for insert with check (public.is_admin());
