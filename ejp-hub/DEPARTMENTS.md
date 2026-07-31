# Architecture multi-département — plan d'implémentation

> Document de planification, écrit **avant tout code**. Il fixe le vocabulaire, le schéma cible,
> les Row Level Security, l'ordre des migrations et l'impact module par module pour transformer
> EJP Hub en **HUB by ICC Reims**, une plateforme unique hébergeant plusieurs départements
> cloisonnés (EJP, Jeunesse, autres ministères…). Rien dans ce document n'est encore implémenté —
> voir [ROADMAP.md](./ROADMAP.md) pour la suite une fois ce plan validé.

## Décisions de cadrage

Trois choix structurent tout le reste du document — tranchés avant d'écrire la moindre migration :

| Question | Décision |
| --- | --- |
| Cloisonnement des données | **Isolation totale par département**, à une exception explicite : **Témoignages reste une communauté partagée à l'échelle de la plateforme** (comme aujourd'hui), pas cloisonnée par département. |
| Adhésion (`/rejoindre`) | **Auto-sélection publique** : le visiteur choisit son département dans une liste publique de départements actifs avant de soumettre sa demande. |
| Rattachement de l'admin général | **Optionnel** : un `SUPER_ADMIN` peut avoir `department_id = null` (rôle purement transverse) ou être rattaché à un département précis (ex. il est aussi membre de l'EJP) — les deux cas doivent fonctionner. |

Une quatrième contrainte est arrivée en cours de cadrage et infuse tout le document : **les modules/onglets visibles doivent pouvoir varier d'un département à l'autre** (ex. Jeunesse n'a pas forcément besoin de « Sujets de prière »). Voir [§7](#7-modules-à-la-carte-par-département).

## Vocabulaire

| Terme | Sens |
| --- | --- |
| **Plateforme** | HUB by ICC Reims — l'application dans son ensemble, une seule instance technique/un seul déploiement. |
| **Département** | Un tenant cloisonné (EJP, Jeunesse, autre ministère…) — nouvelle entité `departments`. |
| **Admin général** (`SUPER_ADMIN`) | Nouveau rôle. Accès à tous les départements, gère la plateforme (créer/configurer des départements, paramètres globaux, promouvoir des admins). |
| **Admin de département** (`ADMIN`) | Le rôle `ADMIN` existant, dont la portée est désormais **restreinte à son propre département** — il ne change pas de nom pour limiter le churn (routes, libellés UI, permissions déjà écrites), seule sa portée change. |
| **Membre** (`PRAYER_LEADER`) | Inchangé, rattaché à un seul département. |

Le nom `PRAYER_LEADER` reste tel quel dans cette phase (renommer en un terme générique type `MEMBER` est noté en [§10, piste V2](#10-hors-périmètre--pistes-v2) — un ministère non-prière garderait quand même un rôle « conducteur/animateur » assimilable, ça ne bloque rien).

## 1. Schéma cible

```
platform_settings (singleton, remplace app_settings)      departments
        │                                                  │ id, slug, name, logo_url,
        │ SUPER_ADMIN only                                 │ description, timezone, language,
        ▼                                                  │ is_active
   (marque plateforme : "HUB by ICC Reims", logo global)    │
                                                             ▼
                                                     department_modules
                                                     (department_id, module_key, enabled)
auth.users
      │ 1:1
      ▼
profiles ── department_id ──► departments   (nullable seulement si role = SUPER_ADMIN)
   │
   ├─► prayer_topics.department_id
   ├─► planning.department_id ──► programs.department_id ──► program_members.department_id
   │        └─► planning_replacement_requests.department_id
   ├─► reports.department_id ──► report_comments.department_id
   ├─► admin_categories.department_id
   ├─► admin_audit_log.department_id (nullable = action plateforme)
   ├─► notifications.department_id (dérivé du destinataire, jamais du client)
   └─► testimonies  ← PAS de department_id (partagé, voir §4)
```

### 1.1 `departments` (nouvelle table)

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `slug` | `text` unique | utilisé dans `/rejoindre/[slug]`, jamais modifié après création |
| `name` | `text` | ex. « EJP », « Jeunesse » |
| `description` | `text` | nullable |
| `logo_url` | `text` | nullable |
| `timezone` | `text` | défaut `'Europe/Paris'` |
| `language` | `text` | défaut `'fr'` |
| `is_active` | `boolean` | défaut `true` — un département désactivé disparaît de la liste publique de `/rejoindre` et bloque la connexion de ses membres (même traitement que `SUSPENDED`, voir §5.5) |
| `created_by` | `uuid` → `profiles.id` | nullable |
| `created_at` / `updated_at` | `timestamptz` | |

Remplace la partie « identité du groupe » de l'actuelle table singleton `app_settings` (nom,
logo, timezone, langue) — chaque département a désormais **sa propre** identité, là où
`app_settings` n'en portait qu'une pour toute la plateforme.

### 1.2 `platform_settings` (renommage de `app_settings`)

Garde la mécanique de singleton actuelle (index unique sur `(true)`), mais son contenu change de
sens : ce n'est plus « les paramètres de l'app » mais **la marque de la plateforme**, gérée
exclusivement par un `SUPER_ADMIN` :

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `platform_name` | `text` | défaut `'HUB by ICC Reims'` (remplace `'EJP Hub'`) |
| `logo_url` | `text` | nullable |
| `updated_by` / `updated_at` | — | inchangé |

`timezone`/`language`/`description` ne survivent pas au renommage : ils deviennent des
propriétés **par département** (`departments.timezone`/`.language`/`.description`), pas de la
plateforme. La migration copie la ligne `app_settings` actuelle vers `platform_settings`
(`platform_name` réécrit en dur) **et** vers le département par défaut créé en §2 (préserve le
comportement actuel pour les données existantes).

### 1.3 `department_modules` (nouvelle table — voir §7)

| Colonne | Type | Notes |
| --- | --- | --- |
| `department_id` | `uuid` → `departments.id`, `on delete cascade` | PK composite avec `module_key` |
| `module_key` | `text` | ex. `PLANNING`, `PRAYER_TOPICS`, `REPORTS`, `TESTIMONIES` — voir §7 pour la liste figée côté code |
| `enabled` | `boolean` | défaut `true` |
| `updated_at` | `timestamptz` | |

### 1.4 Colonne `department_id` ajoutée aux tables existantes

| Table | Nullable ? | Origine de la valeur |
| --- | --- | --- |
| `profiles` | Oui, **seulement si** `role = 'SUPER_ADMIN'` (contrainte `check`) | `app_metadata.department_id` à l'inscription (voir §5), modifiable ensuite uniquement par un `SUPER_ADMIN` |
| `prayer_topics` | Non | Trigger : défaut = département de l'auteur (`created_by`) à l'insertion |
| `planning` | Non | Trigger : défaut = département de l'admin créateur |
| `programs` | Non | Trigger : défaut = département de l'admin créateur |
| `program_members` | Non | Trigger : copié depuis `programs.department_id` |
| `reports` | Non | Trigger : copié depuis `planning.department_id` (via `planning_id`) |
| `report_comments` | Non | Trigger : copié depuis `reports.department_id` |
| `planning_replacement_requests` | Non | Trigger : copié depuis `planning.department_id` |
| `notifications` | Non | Trigger : copié depuis `profiles.department_id` du **destinataire** (`user_id`) |
| `admin_categories` | Non | Passé explicitement par l'admin qui crée la catégorie (plus de portée globale) |
| `admin_audit_log` | **Oui** (`null` = action plateforme, ex. création d'un département) | Passé explicitement par l'appelant |
| `testimonies` | — (pas de colonne, voir §4) | — |
| `push_subscriptions` | — (pas de colonne) | déjà scopé par `user_id`, aucun besoin |

**Règle de sécurité non négociable** : `department_id` n'est **jamais** accepté tel quel dans un
payload client sur une table fille. Chaque trigger `before insert` le recalcule côté serveur
depuis la ligne parente (ou depuis le profil de l'appelant pour les tables racines). Objectif :
même si un client falsifie `department_id` dans sa requête PostgREST, la valeur écrite reste
correcte — la RLS bloque déjà l'essentiel, ce trigger est une défense en profondeur qui évite
aussi des erreurs applicatives silencieuses (un admin qui crée par erreur une ligne dans le
mauvais département).

## 2. Fonctions RLS centralisées

Mêmes principes que l'actuelle `public.is_admin()` (`security definer`, `stable`) — patron déjà
éprouvé dans ce projet pour lire `profiles` sans provoquer de récursion RLS :

```sql
create or replace function public.current_department_id()
returns uuid language sql security definer stable as $$
  select department_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'SUPER_ADMIN');
$$;

-- is_admin() existe déjà : on NE LA RENOMME PAS (elle reste utilisée telle quelle par ~30
-- policies existantes). On redéfinit juste son corps pour couvrir les deux rôles admin :
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN', 'SUPER_ADMIN'));
$$;

create or replace function public.is_department_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN');
$$;
```

Patron de policy réécrit, appliqué table par table (§3) :

```sql
-- Lecture : tout le monde dans son département, + super admin partout
using (public.is_super_admin() or department_id = public.current_department_id())

-- Écriture réservée à l'admin (du département concerné) ou au super admin
using (public.is_super_admin() or (public.is_department_admin() and department_id = public.current_department_id()))
with check (même expression)
```

Garder `is_admin()` = « ADMIN ou SUPER_ADMIN » (au lieu de la renommer) est un choix délibéré :
sur les tables où *aucune* notion de département n'entre en jeu dans la policy actuelle (ex.
`profiles_admin_delete`), rien ne change. Le travail se concentre sur les policies qui ont
vraiment besoin de la clause de département en plus.

## 3. Row Level Security — table par table

Inventaire complet des policies existantes (`supabase/migrations/*row_level_security*`,
`*_details.sql`) et de leur traitement :

| Table / policy actuelle | Traitement |
| --- | --- |
| `profiles_select` (`auth.uid() = id or is_admin()`) | **🔴 Fuite critique à corriger en premier** — voir §3.1 |
| `profiles_update_self_or_admin`, `profiles_admin_insert`, `profiles_admin_delete` | Ajouter la clause département : un `ADMIN` ne modifie/supprime que les profils de son département ; `SUPER_ADMIN` peut tout, y compris changer le `department_id` d'un membre (transfert, voir §6.6) |
| `prayer_topics_select/insert/update/delete` | Ajouter `department_id = current_department_id()` (lecture) et la clause admin+département (écriture) |
| `planning_select/insert/update/delete`, `planning_leader_response_update` | Idem — la réponse du conducteur (`planning_leader_response_update`) reste inchangée dans sa logique (elle ne dépend pas du rôle), seule la lecture/écriture admin gagne la clause département |
| `reports_select/insert_own/update_own_or_admin/delete_admin` | Idem. `reports_select` : conducteur voit les siens **dans son département** (déjà garanti par construction : un conducteur n'a qu'un département) ; admin voit tout son département |
| `report_comments_select/admin_insert` | Idem, via `reports.department_id` |
| `programs_*`, `program_members_*` | Idem |
| `planning_replacement_requests_*` (`replacement_requests_*`) | Idem |
| `testimonies_select/insert_own/update_own_or_admin/delete_own_or_admin` | **Pas de `department_id`** — voir §4 pour la règle spécifique |
| `notifications_select_own/update_own/insert_self_or_admin/delete_own` | Isolation par utilisateur inchangée. `insert_self_or_admin` : un `ADMIN` ne peut insérer que pour un destinataire de **son** département ; `SUPER_ADMIN` pour n'importe qui |
| `app_settings_admin_all` → `platform_settings_super_admin_all` | `is_admin()` → `is_super_admin()` strictement (un admin de département ne doit plus jamais toucher la marque plateforme) |
| `admin_categories_admin_all` | Ajouter la clause département (un admin gère les catégories de son département) |
| `admin_audit_log_select_admin/insert_admin` | Lecture : admin voit les lignes de son département (+ `department_id is null` = jamais, réservé au super admin) ; super admin voit tout |
| `departments_*` (nouvelles) | Lecture : `is_super_admin()` ou `department_id = current_department_id()` (un admin/membre voit les infos de son propre département) ; écriture : `is_super_admin()` uniquement. **Pas de policy pour `anon`** — voir §5.1 |
| `department_modules_*` (nouvelles) | Lecture : comme `departments` (un département doit savoir quels modules il a) ; écriture : `is_super_admin()` uniquement |
| `push_subscriptions_*` | **Aucun changement** — déjà scopées par `user_id`, aucune notion de département nécessaire |
| `avatars_*` (Storage) | **Aucun changement** — chemin déjà scopé par `user_id` |

### 3.1 Correction prioritaire : `profiles_select`

Depuis `20260813090001_member_deletion_and_profile_visibility.sql`, cette policy est
volontairement ouverte à *tout* utilisateur authentifié (corrige un bug d'embed PostgREST — voir
[`DATABASE.md#profiles`](./DATABASE.md#profiles)). En multi-département, elle devient une fuite
inter-tenant réelle : un membre Jeunesse pourrait lire nom/email/téléphone de n'importe quel
membre EJP via un `select * from profiles`. Nouvelle version :

```sql
create policy "profiles_select" on public.profiles
  for select using (
    auth.uid() = id
    or public.is_super_admin()
    or department_id = public.current_department_id()
  );
```

**Impact à tester manuellement après cette migration** : tous les embeds PostgREST qui dépendent
aujourd'hui de la policy ouverte — `planning.prayer_leader_id/secondary_leader_id → profiles`,
`reports.prayer_leader_id/created_by → profiles`, `report_comments.author_id → profiles` — restent
corrects puisque ces lignes sont, par construction, toujours dans le même département que le
lecteur. Le seul cas qui casse est `testimonies.author_id → profiles`, traité en §4.

## 4. Témoignages : partagés, pas cloisonnés

Décision de cadrage : le flux Témoignages reste une communauté commune à toute la plateforme.
Deux conséquences directes :

- **`testimonies` ne reçoit pas de `department_id`** ; `testimonies_select` reste ouverte à tout
  utilisateur authentifié, quel que soit son département — c'est la seule table métier dans ce
  cas, et c'est intentionnel (documenté comme tel, pas un oubli).
- **`testimonies_delete_own_or_admin` doit être précisée** : aujourd'hui `is_admin()` permet à
  n'importe quel admin de supprimer n'importe quel témoignage. Avec des admins de département
  scopés, un admin ne devrait modérer que les témoignages **des membres de son propre
  département**, pas ceux d'un autre département juste parce que le flux est partagé :

  ```sql
  using (
    auth.uid() = author_id
    or public.is_super_admin()
    or (
      public.is_department_admin()
      and exists (
        select 1 from public.profiles p
        where p.id = testimonies.author_id and p.department_id = public.current_department_id()
      )
    )
  )
  ```

- **Problème induit par la correction de §3.1** : `testimonies.author_id → profiles` est un embed
  cross-département par nature (un témoignage EJP doit afficher le nom d'un auteur EJP à un
  lecteur Jeunesse). Or `profiles_select` corrigée ne l'autorise plus. Solution retenue : ne pas
  réouvrir `profiles` — créer une **vue restreinte** dédiée à cet usage, lisible par tout
  utilisateur authentifié, qui n'expose que les colonnes déjà non sensibles (aucune donnée
  sensible n'est de toute façon affichée nulle part hors profil/fiche membre, voir
  [`DATABASE.md#profiles`](./DATABASE.md#profiles)) :

  ```sql
  create view public.public_profile_directory
  with (security_invoker = false) as
  select id, firstname, lastname, avatar_url, (deleted_at is not null) as is_deleted
  from public.profiles;

  grant select on public.public_profile_directory to authenticated;
  ```

  `SupabaseTestimonyRepository` embed sur cette vue plutôt que sur `profiles` directement pour la
  relation auteur — seul changement de requête nécessaire dans le module Témoignages.

## 5. Adhésion et connexion

### 5.1 Liste publique des départements

`/rejoindre` doit afficher les départements actifs **avant authentification**. Comme pour
`app/api/upload/route.ts`, on ne rouvre pas de policy `anon` sur `departments` (qui porterait
aussi des colonnes de gestion) : un nouveau point d'entrée serveur, clé `service_role`, ne renvoie
que le strict nécessaire :

```ts
// src/features/departments/actions/get-public-departments.action.ts ("use server")
export async function getPublicDepartments(): Promise<{ id: string; slug: string; name: string; logoUrl: string | null }[]> {
  // client admin (service_role), filtre is_active = true, colonnes limitées
}
```

### 5.2 Formulaire `/rejoindre/[slug]`

`slug` résout le département **côté serveur** (jamais un `department_id` envoyé tel quel par le
client) avant d'appeler `supabase.auth.admin.createUser`. Comme `role`/`status`/`is_active`
aujourd'hui, `department_id` voyage exclusivement via `app_metadata` — jamais `user_metadata` —
pour la même raison documentée dans
[`DATABASE.md#profiles`](./DATABASE.md#profiles) : `user_metadata` est librement modifiable par
n'importe quel appelant de l'API publique. `handle_new_user` doit lire ce champ en plus de
`role`/`status`/`is_active`.

### 5.3 Redemande après refus, et changement de département

`resubmitMembershipRequest` (voir [`MEMBERS.md`](./MEMBERS.md#redemande-après-un-refus)) réutilise
le compte existant par e-mail. Comme `auth.users.email` est unique **pour toute la plateforme**
(pas par département), une personne n'a jamais qu'un seul compte, rattaché à un seul département à
la fois. Si la nouvelle demande cible un `slug` différent de l'ancien département, la fonction doit
**mettre à jour `department_id`** en plus de `status`/`role` — sans ce point explicite, une
personne refusée par l'EJP qui postule ensuite à Jeunesse resterait silencieusement rattachée à
l'EJP.

### 5.4 Validation des demandes — scoping

`/administration/membres/demandes` (aujourd'hui : toutes les demandes `PENDING`, tous confondus)
devient, pour un `ADMIN` : uniquement les demandes de son département. Un `SUPER_ADMIN` doit
pouvoir voir/valider les demandes de n'importe quel département — nécessite un sélecteur de
département dans son espace (voir §6.6), ou une vue agrégée toutes-demandes avec le nom du
département affiché par ligne.

### 5.5 Connexion et département désactivé

`middleware.ts` lit déjà `role`, `status`, `deleted_at` du profil à chaque requête. Il doit aussi
lire `departments.is_active` (jointure) : un membre dont le département est désactivé est bloqué
exactement comme `SUSPENDED` — redirection vers `/compte-en-attente`, avec un message adapté
(« Ce département n'est plus actif »).

## 6. Impact module par module

| Module | Schéma | RLS | Application |
| --- | --- | --- | --- |
| **Auth** | `profiles.department_id` | §3.1, §2 | `roles.ts` (+`SUPER_ADMIN`), `getCurrentProfile`/`guards.ts` renvoient `departmentId`, nouveau `DepartmentProvider`/`useDepartment()` (nom, logo, modules activés — chargé une fois comme `RoleProvider`) |
| **Middleware / routes** | — | — | `route-permissions.ts` : `/administration` → `["ADMIN", "SUPER_ADMIN"]` ; nouveau préfixe `/plateforme` → `["SUPER_ADMIN"]` uniquement ; ajout du filtre modules (§7) et du contrôle `departments.is_active` (§5.5) |
| **Dashboard** | — | hérite des tables sous-jacentes | Toutes les requêtes (`dashboard.queries.ts`) filtrent déjà via les services des autres modules — aucun changement de logique, juste hériter du filtrage département de chaque service appelé |
| **Planning + Programmes** | `department_id` sur `planning`, `programs`, `program_members`, `planning_replacement_requests` | §3 | `PlanningService`/`ProgramService`/`ReplacementRequestService` : `context` gagne `departmentId`, chaque requête Supabase ajoute `.eq('department_id', departmentId)` (défense en profondeur, la RLS bloque déjà) |
| **Sujets de prière** | `department_id` sur `prayer_topics` | §3 | Idem, `PrayerTopicService` |
| **Comptes rendus** | `department_id` sur `reports`, `report_comments` | §3 | Idem, `ReportService`. Le rappel « Relancer » (`send-report-reminder.action.ts`) doit aussi vérifier que l'admin appelant et le créneau sont dans le même département |
| **Membres** | `profiles.department_id` | §3.1, §5 | `/rejoindre` → `/rejoindre/[slug]` (§5.2), `MemberService.list` filtré par département pour un `ADMIN`, nouvelle méthode `MemberService.changeDepartment` (`SUPER_ADMIN` uniquement, voir §6.6), `AdminRoles` (sélecteur de rôle) ne doit jamais proposer `SUPER_ADMIN` à un `ADMIN` de département |
| **Notifications** | `department_id` sur `notifications` (dérivé, jamais du client) | §3 (policy `insert_self_or_admin`) | **Tous les triggers `security definer`** (`20260806090001_notification_triggers.sql`, `20260808…`, `20260809…`, `20260810…`, `20260812…`) qui notifient aujourd'hui « tous les `ADMIN` actifs » doivent filtrer sur le département de la ligne source (`planning`/`reports`/`profiles` concernée) — **sans ce correctif, un CR soumis dans Jeunesse notifierait les admins de l'EJP.** C'est le bug fonctionnel n°1 à ne pas rater. `pg_cron` (`send_report_reminders`, `send_upcoming_slot_reminders`) : même correctif sur le filtre destinataire |
| **Administration** | `department_id` sur `admin_categories`, `admin_audit_log` | §3 | `AdminService`/`AdminSearch`/`AdminAuditService` scopés par département pour un `ADMIN` ; `/administration/parametres` édite désormais la ligne `departments` du contexte courant (plus `app_settings`) |
| **Témoignages** | Pas de `department_id`, voir §4 | §4 | Embed auteur via `public_profile_directory` (§4), règle de suppression précisée |
| **Départements** *(nouveau module)* | `departments`, `department_modules`, `platform_settings` | §3 | Voir §6.6 |

### 6.6 Nouveau module `features/departments/`

Réservé au `SUPER_ADMIN` (routes sous `/plateforme`) :

- CRUD département (créer, éditer, activer/désactiver — jamais de suppression dure, un
  département désactivé garde tout son historique, même logique que `profiles.deleted_at`).
- Écran « Paramètres plateforme » (`platform_settings` : nom, logo — remplace l'actuel
  `/administration/parametres` pour la partie marque globale).
- Gestion des modules activés par département (§7).
- `MemberService.changeDepartment(memberId, newDepartmentId)` — déplacer un membre d'un
  département à l'autre, action rare et sensible, volontairement réservée au `SUPER_ADMIN` (un
  admin de département ne doit pas pouvoir faire sortir/entrer des membres d'un département dont
  il n'a pas la charge).
- Sélecteur de département (« vue actuelle ») : purement une commodité d'UI/URL pour le
  `SUPER_ADMIN` naviguant dans `/administration/*` de plusieurs départements — **pas** une
  frontière de sécurité (celle-ci est déjà entièrement couverte par `is_super_admin()` dans les
  RLS). Implémentation la plus simple : paramètre de route ou cookie léger, lu par les services
  applicatifs pour savoir quel `department_id` filtrer explicitement dans leurs requêtes.
- Tableau de bord plateforme (agrégat tous départements) — même patron que `AdminService`
  aujourd'hui (jamais d'accès direct aux tables des autres modules, uniquement leurs services
  publics), simplement itéré par département.

## 7. Modules à la carte par département

Ajout arrivé en cours de cadrage : deux départements n'ont pas forcément besoin des mêmes onglets
(ex. Jeunesse peut ne pas activer « Sujets de prière »). Traitement retenu :

- Une liste **fermée, définie côté code** de clés de module (`shared/constants/modules.ts`) :
  `PLANNING`, `PRAYER_TOPICS`, `REPORTS`, `TESTIMONIES` (et éventuellement `MEMBERS`,
  `NOTIFICATIONS`, `DASHBOARD`, `ADMIN` si on veut aussi pouvoir les désactiver — recommandé de les
  garder **toujours actifs**, ce sont des modules transverses/de fondation, pas des modules
  « métier » optionnels).
- `department_modules` (table, §1.3) porte l'état `enabled` par `(department_id, module_key)`.
  Ajouter un futur module ne demande qu'une nouvelle valeur de clé + une ligne par département,
  jamais de migration de schéma supplémentaire — même philosophie que `admin_category_scope`
  (extensible sans changer la structure).
- **Seul un `SUPER_ADMIN` active/désactive un module pour un département** (décision de
  plateforme/offre, pas un réglage que l'admin d'un département choisit lui-même) — géré dans le
  nouveau module Départements (§6.6), jamais dans `/administration/parametres`.
- **Portée du contrôle** : navigation (`nav-items.ts` filtre déjà par rôle via
  `ROUTE_PERMISSIONS` — il filtre en plus par module activé du département courant) et middleware
  (une tentative d'accès direct à l'URL d'un module désactivé redirige, même logique que
  `ROUTE_PERMISSIONS`). **Volontairement pas de traduction en RLS** : un module désactivé est un
  choix de produit/configuration, pas une frontière de sécurité entre départements — celle-ci
  reste entièrement portée par `department_id` (§3). Complexifier chaque policy avec une
  vérification de module activé n'apporterait aucune protection supplémentaire (les données d'un
  département restent de toute façon invisibles aux autres départements) pour un coût de
  maintenance réel sur ~25 policies.
- `DepartmentProvider` (§6, ligne Auth) charge `department_modules` du département courant une
  seule fois à la connexion, exposé via `useDepartmentModules(): Set<ModuleKey>` — consommé par
  `nav-items.ts` et par le layout `(app)` pour rediriger si un module devient inaccessible.
- Migration d'initialisation : le département par défaut créé en §8 (étape 1) reçoit tous les
  modules `enabled = true`, pour zéro régression fonctionnelle le jour de la migration.

## 8. Ordre des étapes (migrations + code)

Chaque phase est livrable et testable indépendamment ; ne pas paralléliser les phases 1 et 2
(le reste du plan dépend d'un schéma stable).

**Phase 1 — Fondations base de données** *(le plus gros risque, à isoler et valider avant de
toucher au code applicatif)*
1. `departments` + `platform_settings` (renommage `app_settings`) + `department_modules`.
2. `alter type user_role add value 'SUPER_ADMIN'`.
3. Créer un département par défaut (reprend les valeurs actuelles de `app_settings` : nom, logo,
   timezone, langue) ; seed `department_modules` = tout activé pour ce département.
4. `profiles.department_id` (+ contrainte `check`) ; backfill vers le département par défaut pour
   toutes les lignes existantes (`role <> 'SUPER_ADMIN'`).
5. **Corriger `profiles_select`** (§3.1) — en priorité, avant toute autre policy.
6. Fonctions `current_department_id()`, `is_super_admin()`, `is_department_admin()`, redéfinition
   de `is_admin()` (§2).

**Phase 2 — RLS et colonnes des tables métier**
7. `department_id` + trigger de dérivation + backfill + `not null` + policies réécrites, table par
   table dans l'ordre de dépendance : `prayer_topics` → `planning` → `programs` →
   `program_members` → `reports` → `report_comments` → `planning_replacement_requests` →
   `admin_categories` → `admin_audit_log` → `notifications`.
8. Traitement spécifique `testimonies` (§4) : policy de suppression précisée, vue
   `public_profile_directory`.
9. `platform_settings_super_admin_all` (remplace `app_settings_admin_all`).

**Phase 3 — Plomberie applicative transverse**
10. `roles.ts` (+`SUPER_ADMIN`), `getCurrentProfile`, `guards.ts`, `route-permissions.ts`,
    `middleware.ts` (departmentId, `departments.is_active`), `DepartmentProvider`/`useDepartment()`.

**Phase 4 — Nouveau module Départements**
11. CRUD départements, écran paramètres plateforme, gestion des modules activés (§7), sélecteur de
    département pour le `SUPER_ADMIN`, tableau de bord plateforme agrégé.

**Phase 5 — Retrofit des modules existants**
12. Planning + Programmes, Sujets de prière, Comptes rendus, Membres (`/rejoindre/[slug]`, §5),
    Témoignages (embed auteur), Administration (dashboard/recherche/catégories/journal).

**Phase 6 — Notifications**
13. Réécriture des triggers `security definer` et des fonctions `pg_cron` pour filtrer les
    destinataires admin par département (voir tableau §6, ligne Notifications — bug fonctionnel
    prioritaire).

**Phase 7 — Marque et branding**
14. `APP_NAME`/métadonnées → lecture de `platform_settings` (« HUB by ICC Reims ») ; nom/logo du
    département affiché dans le header/sidebar une fois connecté ; page `/rejoindre` et écran de
    connexion présentent la marque plateforme + le département le cas échéant.

**Phase 8 — Données et documentation**
15. `scripts/seed.ts` : au moins deux départements, un `SUPER_ADMIN` (`department_id = null` pour
    illustrer le cas), un `ADMIN` + deux `PRAYER_LEADER` par département.
16. Mise à jour de `DATABASE.md`, `ARCHITECTURE.md`, `ADMIN.md`, `MEMBERS.md`,
    `AUTHENTICATION.md`, `PROJECT.md` (table des modules) pour refléter le nouveau schéma.
17. Checklist QA manuelle : connecté en `ADMIN` département A, vérifier zéro visibilité sur
    Planning/Comptes rendus/Membres/Sujets de prière du département B ; connecté en
    `SUPER_ADMIN`, vérifier l'accès complet + le sélecteur de département ; vérifier qu'un CR
    soumis dans B ne notifie pas les admins de A.

## 9. Points de vigilance

1. **`profiles_select` est la fuite n°1** — à corriger avant toute autre policy, et à re-tester
   contre tous les embeds existants (Planning, Comptes rendus, Journal d'audit).
2. **Ne jamais faire confiance à un `department_id` envoyé par le client** sur une table fille —
   toujours dérivé côté serveur par trigger depuis la ligne parente ou depuis le profil de
   l'appelant.
3. **`is_admin()` redéfinie = « ADMIN ou SUPER_ADMIN »**, pas « accès à tout » — chaque policy qui
   l'utilise aujourd'hui pour un bypass total (`app_settings`, `admin_categories`,
   `admin_audit_log`) doit être auditée une par une (tableau §3) : certaines doivent devenir
   `is_super_admin()` strict (marque plateforme), d'autres gagnent juste la clause département.
4. **Un e-mail = un compte = un département à la fois** (`auth.users.email` unique
   plateforme-wide) — changer de département est une action explicite (`changeDepartment`), jamais
   implicite lors d'une redemande.
5. **Fonctions RLS `security definer stable`** obligatoire pour `current_department_id()` et
   `is_super_admin()` — même patron que `is_admin()` déjà en place, pour éviter récursion RLS sur
   `profiles` et régression de performance.
6. **Liste publique des départements sans ouvrir `departments` à `anon`** — passer par un point
   d'entrée serveur (clé `service_role`), pas par une policy RLS pour le rôle `anon`.
7. **Modules désactivés = UX/routage, pas RLS** (§7) — ne pas complexifier les policies pour ça,
   l'isolation entre départements est déjà garantie indépendamment.
8. Ce dépôt est encore en phase RC1, sans persistance de production réelle (voir
   [ROADMAP.md](./ROADMAP.md)) — le risque d'une migration de backfill est donc faible aujourd'hui,
   mais à écrire quand même comme si des données réelles existaient déjà (idempotente,
   réversible), la mise en production pouvant arriver à tout moment après cette RC.

## 10. Hors périmètre / pistes V2

- Renommer `PRAYER_LEADER` en un terme générique (`MEMBER`) si des départements non liés à la
  prière rejoignent la plateforme et que le libellé devient trompeur.
- Catégories (`admin_categories`) personnalisables réellement différentes d'un département à
  l'autre au-delà du simple CRUD déjà prévu (ex. jeux de catégories totalement différents par
  métier de département).
- Facturation/plan par département (le concept `department_modules` s'y prêterait comme base,
  sans y être couplé aujourd'hui).
- Statistiques comparatives inter-départements pour le `SUPER_ADMIN` au-delà de l'agrégat simple.
