-- =============================================================================
-- reports — modèle métier du module Comptes rendus
--
-- La migration 20260728100005 posait la structure minimale (un CR par
-- créneau, contenu libre, soumis immédiatement). Le module Comptes rendus ne
-- documente pas un compte rendu de réunion générique : il reproduit le
-- déroulé réel d'une chaîne de prière de l'EJP — informations générales,
-- actions de grâce, invitation du Saint-Esprit, points de prière (chacun
-- avec ses propres références bibliques), fin/actions de grâce, annonces —
-- avec le cycle de vie complet brouillon → soumis → validé/rejeté et un
-- historique de commentaires admin.
--
-- Les listes de références bibliques et les points de prière sont des
-- structures imbriquées de taille variable (un point peut avoir un nombre
-- illimité de versets) : elles sont stockées en jsonb plutôt que
-- normalisées en tables filles, ce qui reste cohérent avec l'approche
-- mock-first du reste du module et évite une explosion relationnelle pour
-- un contenu qui n'est jamais interrogé colonne par colonne (toujours lu et
-- écrit comme un bloc par section). Voir REPORTS.md pour le détail du choix.
-- =============================================================================

do $$ begin
  create type public.report_status as enum ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REJECTED');
exception when duplicate_object then null; end $$;

alter table public.reports
  add column if not exists status public.report_status not null default 'DRAFT',
  add column if not exists created_by uuid references public.profiles (id),
  add column if not exists session_date date,
  add column if not exists session_start_time time,
  add column if not exists session_end_time time,
  add column if not exists connected_count integer check (connected_count >= 0),
  add column if not exists has_instrumental boolean not null default false,
  add column if not exists thanksgiving jsonb not null default '[]'::jsonb,
  add column if not exists holy_spirit_invitation jsonb not null default '[]'::jsonb,
  add column if not exists prayer_points jsonb not null default '[]'::jsonb,
  add column if not exists closing_thanksgiving jsonb not null default '[]'::jsonb,
  add column if not exists announcements text,
  add column if not exists validated_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

-- Rétrocompatibilité : les CR déjà existants (posés avant tout workflow) sont
-- réputés rédigés par le conducteur assigné et déjà soumis, avec la date du
-- créneau reprise comme date de séance par défaut.
update public.reports set created_by = prayer_leader_id where created_by is null;
alter table public.reports alter column created_by set not null;

update public.reports r
set session_date = p.slot_date, session_start_time = p.start_time, session_end_time = p.end_time
from public.planning p
where r.planning_id = p.id and r.session_date is null;

alter table public.reports alter column session_date set not null;
alter table public.reports alter column session_start_time set not null;
alter table public.reports alter column session_end_time set not null;

-- `attendees_count` devient `connected_count` (« Nombre de personnes
-- connectées » — la terminologie du modèle cible), et les champs de contenu
-- libre de l'ancienne structure générique n'ont pas d'équivalent dans le
-- déroulé réel d'une chaîne de prière : ils sont abandonnés au profit des
-- sections structurées ci-dessus.
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'reports' and column_name = 'attendees_count'
  ) then
    update public.reports set connected_count = attendees_count where connected_count is null;
  end if;
end $$;
alter table public.reports drop column if exists attendees_count;
alter table public.reports drop column if exists topics_covered;
alter table public.reports drop column if exists content;
alter table public.reports drop column if exists follow_up;

-- `submitted_at` ne doit être renseigné qu'au moment de la soumission
-- effective — un brouillon n'a pas encore de date de soumission.
alter table public.reports alter column submitted_at drop not null;
alter table public.reports alter column submitted_at drop default;
update public.reports set submitted_at = null where status = 'DRAFT';

create index if not exists reports_status_idx on public.reports (status);
create index if not exists reports_created_by_idx on public.reports (created_by);

comment on column public.reports.created_by is
  'Auteur du compte rendu — distinct de prayer_leader_id si un jour un tiers rédige pour un conducteur.';
comment on column public.reports.validated_at is
  'Renseignée automatiquement lors du passage au statut VALIDATED.';
comment on column public.reports.session_date is
  'Date effective de la séance — préremplie depuis le Planning, modifiable par le conducteur.';
comment on column public.reports.thanksgiving is
  'Actions de grâce (ouverture) — tableau jsonb [{id, reference}].';
comment on column public.reports.holy_spirit_invitation is
  'Invitation du Saint-Esprit — tableau jsonb [{id, reference}].';
comment on column public.reports.prayer_points is
  'Points de prière — tableau jsonb [{id, title, references: [{id, reference}]}], ordre = ordre du tableau.';
comment on column public.reports.closing_thanksgiving is
  'Fin / Actions de grâce (clôture) — tableau jsonb [{id, reference}].';
comment on column public.reports.announcements is
  'Annonces communiquées à la fin de la chaîne de prière — texte libre.';

-- L'auteur doit être le conducteur assigné au créneau (règle métier
-- inchangée), mais la vérification RLS porte désormais sur created_by.
drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.planning p
      where p.id = planning_id and p.prayer_leader_id = auth.uid()
    )
  );

drop policy if exists "reports_select" on public.reports;
create policy "reports_select" on public.reports
  for select using (auth.uid() = created_by or public.is_admin());

drop policy if exists "reports_update_own_or_admin" on public.reports;
create policy "reports_update_own_or_admin" on public.reports
  for update using (auth.uid() = created_by or public.is_admin());

-- =============================================================================
-- report_comments — retour de l'administrateur sur un compte rendu
-- =============================================================================

create table if not exists public.report_comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  message text not null,
  created_at timestamptz not null default now()
);

comment on table public.report_comments is
  'Commentaires de suivi (principalement admin) sur un compte rendu — historique conservé intégralement.';

create index if not exists report_comments_report_idx on public.report_comments (report_id);

alter table public.report_comments enable row level security;

drop policy if exists "report_comments_select" on public.report_comments;
create policy "report_comments_select" on public.report_comments
  for select using (
    public.is_admin()
    or exists (select 1 from public.reports r where r.id = report_id and r.created_by = auth.uid())
  );

drop policy if exists "report_comments_admin_insert" on public.report_comments;
create policy "report_comments_admin_insert" on public.report_comments
  for insert with check (public.is_admin() and auth.uid() = author_id);
