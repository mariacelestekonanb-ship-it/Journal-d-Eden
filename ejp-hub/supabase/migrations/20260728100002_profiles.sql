-- =============================================================================
-- profiles — étend auth.users avec les informations applicatives
-- =============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  firstname text not null,
  lastname text not null,
  email text not null unique,
  role public.user_role not null default 'PRAYER_LEADER',
  avatar_url text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil applicatif de chaque utilisateur (rôle, coordonnées, statut).';

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_is_active_idx on public.profiles (is_active);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription d'un utilisateur Supabase Auth.
-- Les champs firstname/lastname/role sont lus depuis les métadonnées passées à
-- `supabase.auth.admin.createUser()` (voir scripts/seed.ts et le futur module
-- Administration, qui invitera les comptes de la même façon).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, firstname, lastname, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'firstname', 'Nouveau'),
    coalesce(new.raw_user_meta_data ->> 'lastname', 'Utilisateur'),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'PRAYER_LEADER')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Empêche un utilisateur non-admin de s'auto-promouvoir ou de se réactiver.
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is not null
     and (select role from public.profiles where id = auth.uid()) <> 'ADMIN'
     and (new.role is distinct from old.role or new.is_active is distinct from old.is_active) then
    raise exception 'Seul un administrateur peut modifier le rôle ou le statut d''un compte.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_escalation on public.profiles;
create trigger profiles_prevent_escalation
  before update on public.profiles
  for each row execute function public.prevent_privilege_escalation();

-- Fonction utilitaire : l'utilisateur courant est-il administrateur ?
-- Utilisée par les policies RLS de toutes les tables (migration RLS).
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'ADMIN'
  );
$$;
