-- Corrige une élévation de privilèges possible via `handle_new_user` : la
-- version précédente lisait `role`/`status`/`is_active` depuis
-- `raw_user_meta_data` (= `user_metadata`), un champ que l'API publique
-- `supabase.auth.signUp` laisse n'importe quel appelant renseigner
-- librement — y compris un visiteur anonyme utilisant directement la clé
-- anonyme (`POST /auth/v1/signup`), indépendamment de ce que le frontend de
-- cette application appelle ou non. Si l'inscription publique GoTrue n'est
-- pas désactivée côté configuration du projet Supabase (un réglage qui ne
-- vit pas dans ces migrations et n'est donc pas garanti), quiconque pouvait
-- jusqu'ici s'auto-créer un compte `ADMIN` déjà `ACTIVE` en un seul appel.
--
-- `raw_app_meta_data` (= `app_metadata`) n'est en revanche jamais
-- accessible en écriture via l'API publique de signUp — seule l'API Admin
-- (clé de service, `supabase.auth.admin.createUser`) peut la renseigner.
-- C'est déjà le canal utilisé par `scripts/seed.ts` et par
-- `adminCreateMembershipRequestQuery` (voir `member-admin.queries.ts`),
-- tous deux mis à jour pour y écrire `role`/`status`/`is_active` désormais.
--
-- Les valeurs par défaut de repli (`role`/`status`/`is_active` absents de
-- `raw_app_meta_data`) passent aussi de `ACTIVE`/`true` à `PENDING`/`false` :
-- si jamais un compte se crée sans que l'appelant ait explicitement précisé
-- ces champs, le compte doit rester bloqué en attente de validation
-- (position la moins privilégiée) plutôt que d'être actif par défaut. Les
-- deux appelants légitimes renseignent toujours ces champs explicitement,
-- ce changement de repli ne modifie donc leur comportement en rien.
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
    coalesce((new.raw_app_meta_data ->> 'role')::public.user_role, 'PRAYER_LEADER'),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_app_meta_data ->> 'status')::public.member_status, 'PENDING'),
    coalesce((new.raw_app_meta_data ->> 'is_active')::boolean, false)
  );
  return new;
end;
$$;
