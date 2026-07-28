-- =============================================================================
-- EJP Hub — extensions & types énumérés
-- =============================================================================

create extension if not exists "pgcrypto";

-- Rôles applicatifs. Voir src/shared/constants/roles.ts pour la liste
-- côté TypeScript (source unique de vérité côté application).
do $$ begin
  create type public.user_role as enum ('ADMIN', 'PRAYER_LEADER');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.topic_priority as enum ('LOW', 'MEDIUM', 'HIGH');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.topic_status as enum ('ACTIVE', 'ARCHIVED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_type as enum ('UPCOMING_SLOT', 'PENDING_REPORT', 'NEW_TOPIC');
exception when duplicate_object then null; end $$;

-- Trigger générique : maintient `updated_at` à jour sur toute table qui en dispose.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
