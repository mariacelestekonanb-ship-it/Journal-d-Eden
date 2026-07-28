-- =============================================================================
-- EJP Hub — schéma Supabase (PostgreSQL)
-- À exécuter dans l'éditeur SQL du projet Supabase, une fois toutes les
-- sections dans l'ordre. Idempotent : peut être rejoué sans dupliquer.
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_cron";

-- -----------------------------------------------------------------------------
-- Types énumérés
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'conducteur');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.topic_priority as enum ('haute', 'moyenne', 'basse');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.topic_status as enum ('actif', 'archive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_type as enum ('creneau_a_venir', 'cr_en_attente', 'nouveau_sujet');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- profiles — étend auth.users
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  role public.user_role not null default 'conducteur',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil applicatif de chaque utilisateur (rôle, coordonnées).';

-- Création automatique du profil à l'inscription d'un utilisateur Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'conducteur')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Empêche un conducteur de s'auto-promouvoir admin ou de se réactiver.
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is not null
     and (select role from public.profiles where id = auth.uid()) <> 'admin'
     and (new.role is distinct from old.role or new.is_active is distinct from old.is_active) then
    raise exception 'Seul un administrateur peut modifier le rôle ou le statut d''un compte.';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_prevent_escalation on public.profiles;
create trigger profiles_prevent_escalation
  before update on public.profiles
  for each row execute function public.prevent_privilege_escalation();

-- -----------------------------------------------------------------------------
-- prayer_topics — Sujets de prière
-- -----------------------------------------------------------------------------
create table if not exists public.prayer_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority public.topic_priority not null default 'moyenne',
  start_date date not null default current_date,
  end_date date,
  status public.topic_status not null default 'actif',
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prayer_topics_dates_check check (end_date is null or end_date >= start_date)
);

comment on table public.prayer_topics is 'Sujets de prière suivis par la communauté, avec archivage automatique après end_date.';

create index if not exists prayer_topics_status_idx on public.prayer_topics (status);

-- Archivage automatique : tout sujet dont la date de fin est dépassée passe en "archive".
create or replace function public.archive_expired_prayer_topics()
returns void
language sql
security definer set search_path = public
as $$
  update public.prayer_topics
  set status = 'archive', updated_at = now()
  where status = 'actif'
    and end_date is not null
    and end_date < current_date;
$$;

select cron.schedule(
  'archive-expired-prayer-topics',
  '0 1 * * *',
  $$select public.archive_expired_prayer_topics();$$
)
where not exists (
  select 1 from cron.job where jobname = 'archive-expired-prayer-topics'
);

-- -----------------------------------------------------------------------------
-- planning_slots — Créneaux de prière
-- -----------------------------------------------------------------------------
create table if not exists public.planning_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  conducteur_id uuid references public.profiles (id),
  prayer_topic_id uuid references public.prayer_topics (id),
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint planning_slots_time_check check (end_time > start_time)
);

comment on table public.planning_slots is 'Créneaux planifiés (vue semaine / mois), assignés à un conducteur.';

create index if not exists planning_slots_date_idx on public.planning_slots (slot_date);
create index if not exists planning_slots_conducteur_idx on public.planning_slots (conducteur_id);

-- -----------------------------------------------------------------------------
-- reports — Comptes rendus (un seul par créneau)
-- -----------------------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null unique references public.planning_slots (id) on delete cascade,
  conducteur_id uuid not null references public.profiles (id),
  attendees_count integer check (attendees_count >= 0),
  topics_covered text,
  content text not null,
  follow_up text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.reports is 'Compte rendu rédigé par le conducteur assigné à un créneau ; un seul CR par créneau.';

-- -----------------------------------------------------------------------------
-- testimonies — Témoignages
-- -----------------------------------------------------------------------------
create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.testimonies is 'Témoignages publiés par les conducteurs ; suppression réservée aux administrateurs.';

-- -----------------------------------------------------------------------------
-- notifications
-- -----------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  message text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_unread_idx on public.notifications (user_id, read_at);

-- Notifie tous les conducteurs actifs lors de la création d'un nouveau sujet.
create or replace function public.notify_new_prayer_topic()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, message, link)
  select id, 'nouveau_sujet', 'Nouveau sujet de prière', new.title, '/sujets-de-priere/' || new.id
  from public.profiles
  where is_active = true and id <> new.created_by;
  return new;
end;
$$;

drop trigger if exists on_prayer_topic_created on public.prayer_topics;
create trigger on_prayer_topic_created
  after insert on public.prayer_topics
  for each row execute function public.notify_new_prayer_topic();

-- Notifie le conducteur assigné lorsqu'un créneau lui est attribué.
create or replace function public.notify_slot_assigned()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.conducteur_id is not null
     and (tg_op = 'INSERT' or new.conducteur_id is distinct from old.conducteur_id) then
    insert into public.notifications (user_id, type, title, message, link)
    values (
      new.conducteur_id,
      'creneau_a_venir',
      'Nouveau créneau de prière',
      'Vous êtes assigné(e) le ' || to_char(new.slot_date, 'DD/MM/YYYY') || ' à ' || to_char(new.start_time, 'HH24:MI'),
      '/planning'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_planning_slot_assigned on public.planning_slots;
create trigger on_planning_slot_assigned
  after insert or update on public.planning_slots
  for each row execute function public.notify_slot_assigned();

-- Rappel quotidien des comptes rendus en attente (créneaux passés sans CR depuis > 24h).
create or replace function public.notify_pending_reports()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, message, link)
  select s.conducteur_id, 'cr_en_attente', 'Compte rendu en attente',
         'Le compte rendu du ' || to_char(s.slot_date, 'DD/MM/YYYY') || ' n''a pas encore été rempli.',
         '/comptes-rendus'
  from public.planning_slots s
  left join public.reports r on r.slot_id = s.id
  where s.conducteur_id is not null
    and r.id is null
    and s.slot_date < current_date
    and s.slot_date >= current_date - interval '14 days'
    and not exists (
      select 1 from public.notifications n
      where n.user_id = s.conducteur_id
        and n.type = 'cr_en_attente'
        and n.link = '/comptes-rendus'
        and n.message like '%' || to_char(s.slot_date, 'DD/MM/YYYY') || '%'
        and n.created_at > now() - interval '1 day'
    );
end;
$$;

select cron.schedule(
  'notify-pending-reports',
  '0 7 * * *',
  $$select public.notify_pending_reports();$$
)
where not exists (
  select 1 from cron.job where jobname = 'notify-pending-reports'
);

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.prayer_topics enable row level security;
alter table public.planning_slots enable row level security;
alter table public.reports enable row level security;
alter table public.testimonies enable row level security;
alter table public.notifications enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert" on public.profiles
  for insert with check (public.is_admin() or auth.uid() = id);

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete" on public.profiles
  for delete using (public.is_admin());

-- prayer_topics : lecture pour tous les connectés, écriture réservée admin
drop policy if exists "prayer_topics_select" on public.prayer_topics;
create policy "prayer_topics_select" on public.prayer_topics
  for select using (auth.uid() is not null);

drop policy if exists "prayer_topics_admin_write" on public.prayer_topics;
create policy "prayer_topics_admin_write" on public.prayer_topics
  for insert with check (public.is_admin());

drop policy if exists "prayer_topics_admin_update" on public.prayer_topics;
create policy "prayer_topics_admin_update" on public.prayer_topics
  for update using (public.is_admin());

drop policy if exists "prayer_topics_admin_delete" on public.prayer_topics;
create policy "prayer_topics_admin_delete" on public.prayer_topics
  for delete using (public.is_admin());

-- planning_slots : lecture pour tous, écriture réservée admin
drop policy if exists "planning_slots_select" on public.planning_slots;
create policy "planning_slots_select" on public.planning_slots
  for select using (auth.uid() is not null);

drop policy if exists "planning_slots_admin_write" on public.planning_slots;
create policy "planning_slots_admin_write" on public.planning_slots
  for insert with check (public.is_admin());

drop policy if exists "planning_slots_admin_update" on public.planning_slots;
create policy "planning_slots_admin_update" on public.planning_slots
  for update using (public.is_admin());

drop policy if exists "planning_slots_admin_delete" on public.planning_slots;
create policy "planning_slots_admin_delete" on public.planning_slots
  for delete using (public.is_admin());

-- reports : un conducteur ne voit / modifie que son propre CR ; admin voit tout
drop policy if exists "reports_select" on public.reports;
create policy "reports_select" on public.reports
  for select using (auth.uid() = conducteur_id or public.is_admin());

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert with check (
    auth.uid() = conducteur_id
    and exists (
      select 1 from public.planning_slots s
      where s.id = slot_id and s.conducteur_id = auth.uid()
    )
  );

drop policy if exists "reports_update_own_or_admin" on public.reports;
create policy "reports_update_own_or_admin" on public.reports
  for update using (auth.uid() = conducteur_id or public.is_admin());

drop policy if exists "reports_delete_admin" on public.reports;
create policy "reports_delete_admin" on public.reports
  for delete using (public.is_admin());

-- testimonies : tout utilisateur connecté peut publier, seul l'admin supprime
drop policy if exists "testimonies_select" on public.testimonies;
create policy "testimonies_select" on public.testimonies
  for select using (auth.uid() is not null);

drop policy if exists "testimonies_insert_own" on public.testimonies;
create policy "testimonies_insert_own" on public.testimonies
  for insert with check (auth.uid() = author_id);

drop policy if exists "testimonies_update_own_or_admin" on public.testimonies;
create policy "testimonies_update_own_or_admin" on public.testimonies
  for update using (auth.uid() = author_id or public.is_admin());

drop policy if exists "testimonies_delete_admin_only" on public.testimonies;
create policy "testimonies_delete_admin_only" on public.testimonies
  for delete using (public.is_admin());

-- notifications : chacun ne voit / ne modifie que les siennes
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);

-- =============================================================================
-- Storage — avatars des profils
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
