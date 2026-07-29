-- =============================================================================
-- profiles — workflow d'adhésion du module Membres
--
-- `profiles` existe depuis 20260728100002 mais ne portait aucune notion de
-- statut d'adhésion (tout compte y était implicitement actif, créé par un
-- admin ou par le seed). Le module Membres a besoin du cycle de vie complet
-- d'une demande d'adhésion publique : PENDING → ACTIVE | REFUSED, avec une
-- transition supplémentaire ACTIVE ↔ SUSPENDED pour la modération courante.
-- =============================================================================

do $$ begin
  create type public.member_status as enum ('PENDING', 'ACTIVE', 'REFUSED', 'SUSPENDED');
exception when duplicate_object then null; end $$;

alter table public.profiles
  add column if not exists status public.member_status not null default 'ACTIVE',
  add column if not exists validated_at timestamptz,
  add column if not exists validated_by uuid references public.profiles (id);

create index if not exists profiles_status_idx on public.profiles (status);

comment on column public.profiles.status is
  'Statut d''adhésion — PENDING à la demande, ACTIVE une fois validé, REFUSED ou '
  'SUSPENDED sinon. Tenu en cohérence avec is_active (ACTIVE ⇔ is_active = true) par '
  'le module Membres (MemberService), pour ne rien changer aux requêtes existantes '
  '(Planning, Sujets de prière) qui filtrent déjà sur is_active.';
comment on column public.profiles.validated_at is
  'Renseignée automatiquement lors du passage de PENDING à ACTIVE ou REFUSED.';
comment on column public.profiles.validated_by is
  'Administrateur ayant traité la demande d''adhésion (accepté ou refusé).';

-- `handle_new_user` lit désormais aussi phone/status/is_active depuis les
-- métadonnées de `auth.users`, pour permettre à une demande d'adhésion
-- publique (features/members, via l'API Admin et le mot de passe choisi par
-- le demandeur) de créer un compte PENDING et inactif. Le chemin existant
-- (seed, futures invitations admin) ne passe pas ces métadonnées et obtient
-- donc ACTIVE / actif par défaut, exactement comme avant.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, firstname, lastname, email, role, phone, status, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'firstname', 'Nouveau'),
    coalesce(new.raw_user_meta_data ->> 'lastname', 'Utilisateur'),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'PRAYER_LEADER'),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'status')::public.member_status, 'ACTIVE'),
    coalesce((new.raw_user_meta_data ->> 'is_active')::boolean, true)
  );
  return new;
end;
$$;

-- La garde anti-élévation de privilèges couvre désormais aussi `status` et
-- `email` (spec Membres : « l'email reste modifiable uniquement par un
-- administrateur ») — même principe que role/is_active : bloqué pour tout
-- acteur authentifié non-admin, jamais bloqué pour le service_role (utilisé
-- par les Server Actions d'administration, `auth.uid()` y est toujours nul).
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is not null
     and (select role from public.profiles where id = auth.uid()) <> 'ADMIN'
     and (
       new.role is distinct from old.role
       or new.is_active is distinct from old.is_active
       or new.status is distinct from old.status
       or new.email is distinct from old.email
     ) then
    raise exception 'Seul un administrateur peut modifier le rôle, le statut ou l''e-mail d''un compte.';
  end if;
  return new;
end;
$$;
