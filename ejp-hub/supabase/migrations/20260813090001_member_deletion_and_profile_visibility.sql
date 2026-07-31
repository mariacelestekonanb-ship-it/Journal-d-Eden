-- =============================================================================
-- 1) Suppression (douce) d'un membre par un admin : le profil et son historique
--    (créneaux conduits, comptes rendus, témoignages...) restent intacts — seule
--    la connexion est bloquée, comme pour une suspension. `deleted_at` est
--    distinct de `status`/`is_active` pour permettre d'afficher un badge
--    « Supprimé » propre, différent de « Suspendu ».
-- 2) profiles_select élargie à tout utilisateur connecté (corrige un bug
--    systémique de noms manquants dans les embeds Planning/CR/Témoignages).
-- 3) testimonies : un auteur peut aussi supprimer son propre témoignage (pas
--    seulement un admin).
-- =============================================================================

alter table public.profiles add column if not exists deleted_at timestamptz;

comment on column public.profiles.deleted_at is
  'Suppression douce par un admin — profil et historique conservés (planning, comptes rendus, témoignages), connexion bloquée. NULL = compte non supprimé.';

-- Remplace la fonction existante (protège déjà role/is_active/status/email) pour y ajouter deleted_at.
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
       or new.deleted_at is distinct from old.deleted_at
     ) then
    raise exception 'Seul un administrateur peut modifier le rôle, le statut, l''e-mail ou la suppression d''un compte.';
  end if;
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles_select élargie : un conducteur non-admin ne pouvait lire QUE son
-- propre profil (auth.uid() = id or is_admin()) — tout embed PostgREST vers
-- `profiles` depuis une autre table (planning.prayer_leader_id,
-- reports.prayer_leader_id/created_by, testimonies.author_id...) respecte
-- cette même RLS. Un conducteur consultant un créneau conduit par quelqu'un
-- d'autre voyait donc un nom vide (null), pas seulement un problème pour les
-- témoignages qui viennent de le révéler. Alignée sur les autres tables déjà
-- lisibles par tout utilisateur connecté (prayer_topics, planning) — les
-- données sensibles (email, téléphone) ne sont de toute façon montrées nulle
-- part côté UI en dehors de son propre profil ou de la fiche membre (admin).
-- -----------------------------------------------------------------------------

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() is not null);

-- -----------------------------------------------------------------------------
-- testimonies : tout le monde publie déjà librement (testimonies_insert_own,
-- auth.uid() = author_id, aucune modération) — seule la suppression était
-- réservée à l'admin. Un auteur doit aussi pouvoir retirer son propre témoignage.
-- -----------------------------------------------------------------------------

drop policy if exists "testimonies_delete_admin_only" on public.testimonies;
drop policy if exists "testimonies_delete_own_or_admin" on public.testimonies;
create policy "testimonies_delete_own_or_admin" on public.testimonies
  for delete using (auth.uid() = author_id or public.is_admin());
