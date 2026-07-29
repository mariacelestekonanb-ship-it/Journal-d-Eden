# Base de données

Schéma Postgres géré via la **Supabase CLI** — fichiers dans `supabase/migrations/`, appliqués dans
l'ordre de leur nom (horodatage croissant). Voir [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) pour la
procédure d'application.

> Toutes les tables ci-dessous sont créées avec leurs relations, index et Row Level Security dès
> cette étape, **même si aucun module ne les utilise encore** applicativement (aucun CRUD, aucune
> page). C'est une demande explicite du brief : préparer la structure pour que chaque futur module
> n'ait qu'à écrire des requêtes, jamais du DDL.

## Schéma

```
auth.users (géré par Supabase Auth)
      │ 1:1
      ▼
profiles ──────────────┬──────────────┬──────────────┬──────────────┐
   │ created_by        │ prayer_leader_id             │ author_id     │ created_by/author_id
   ▼                    ▼                              ▼               ▼
prayer_topics ◄─── planning                     testimonies    reports ── report_comments
                       │ 1:1 (planning_id)                        ▲ report_id
                       ▼                                          │
                    reports ───────────────────────────────────────┘

notifications (user_id → profiles)
```

### `profiles`

Étend `auth.users` avec les informations applicatives — c'est la table métier du module
**Membres** (voir [`MEMBERS.md`](./MEMBERS.md)). Créé automatiquement par le trigger
`handle_new_user` à chaque inscription (voir `20260728100002_profiles.sql`, complété par
`20260801090001_members_details.sql` pour le workflow d'adhésion).

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | = `auth.users.id` |
| `firstname` | `text` | |
| `lastname` | `text` | |
| `email` | `text` | unique — modifiable uniquement par un admin (voir sécurité ci-dessous) |
| `role` | `user_role` | `ADMIN` \| `PRAYER_LEADER`, défaut `PRAYER_LEADER` |
| `avatar_url` | `text` | nullable |
| `phone` | `text` | nullable |
| `is_active` | `boolean` | défaut `false` — tenu en cohérence avec `status` (`ACTIVE` ⇔ `true`) par `MemberService`, jamais par une contrainte SQL |
| `status` | `member_status` | `PENDING` \| `ACTIVE` \| `REFUSED` \| `SUSPENDED`, défaut `PENDING` (voir sécurité de `handle_new_user` ci-dessous) |
| `validated_at` | `timestamptz` | nullable — renseignée au passage `PENDING` → `ACTIVE`/`REFUSED` |
| `validated_by` | `uuid` → `profiles.id` | nullable — administrateur ayant traité la demande |
| `created_at` / `updated_at` | `timestamptz` | `updated_at` maintenu par `set_updated_at()` ; `created_at` sert de « date d'inscription » |

**Sécurité** : le trigger `prevent_privilege_escalation` empêche un utilisateur non-`ADMIN` de
modifier `role`, `is_active`, `status` ou `email` — y compris les siens. Seul un `ADMIN` (ou la clé
`service_role`, donc `scripts/seed.ts` et les Server Actions du module Membres) peut changer ces
colonnes.

`handle_new_user` lit `firstname`/`lastname`/`phone` depuis `raw_user_meta_data`
(`user_metadata`), mais **`role`/`status`/`is_active` depuis `raw_app_meta_data`
(`app_metadata`)** — voir `20260804090001_fix_privilege_escalation_signup.sql`. Ce n'est pas
un détail : `user_metadata` est un champ que l'API publique `auth.signUp` laisse n'importe quel
appelant renseigner librement (y compris un visiteur anonyme appelant directement l'API GoTrue
avec la clé anonyme, indépendamment de ce que le frontend appelle), alors que `app_metadata`
n'est écrivible que par l'API Admin (clé de service). Lire `role`/`status`/`is_active` depuis
`user_metadata` aurait permis à quiconque de s'auto-créer un compte `ADMIN` déjà `ACTIVE`. Les
deux seuls appelants légitimes (`scripts/seed.ts`, `adminCreateMembershipRequestQuery`) utilisent
tous deux l'API Admin et passent donc déjà ces trois champs via `app_metadata` ; le repli par
défaut en leur absence est désormais `PENDING`/`false` (la position la moins privilégiée), plutôt
que l'ancien `ACTIVE`/`true`.

Index : `role`, `is_active`, `status`.

### `prayer_topics`

Étendue par `20260730090001_prayer_topics_details.sql` (module Sujets de prière) : les enums
`topic_priority`/`topic_status` d'origine ont été **remplacés** (pas étendus) par
`prayer_topic_priority`/`prayer_topic_status`, et une colonne `category` a été ajoutée.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `title` | `text` | |
| `description` | `text` | nullable |
| `category` | `prayer_topic_category` | `CHURCH` \| `FAMILY` \| `YOUTH` \| `EVANGELISM` \| `HEALING` \| `NATIONS` \| `PERSONAL`, défaut `CHURCH` |
| `priority` | `prayer_topic_priority` | `LOW` \| `NORMAL` \| `HIGH` \| `URGENT`, défaut `NORMAL` (remplace l'ancien `topic_priority` LOW/MEDIUM/HIGH — `MEDIUM` a été migré vers `NORMAL`) |
| `start_date` / `end_date` | `date` | `end_date` nullable, `end_date >= start_date` |
| `status` | `prayer_topic_status` | `DRAFT` \| `ACTIVE` \| `COMPLETED` \| `ARCHIVED`, défaut `DRAFT` (remplace l'ancien `topic_status` ACTIVE/ARCHIVED) |
| `archived_at` | `timestamptz` | nullable, renseignée à l'archivage |
| `created_by` | `uuid` → `profiles.id` | |

Index : `status`, `priority`, `created_by`, `category`, `archived_at`.

### `planning`

Créneaux de prière assignés à un conducteur. Étendue par
`20260729090001_planning_details.sql` (module Planning) pour porter le modèle métier complet.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `title` | `text` | |
| `description` | `text` | nullable |
| `slot_date` | `date` | |
| `start_time` / `end_time` | `time` | `end_time > start_time` |
| `prayer_leader_id` | `uuid` → `profiles.id` | nullable (créneau non encore assigné) |
| `secondary_leader_id` | `uuid` → `profiles.id` | nullable, second conducteur |
| `prayer_topic_id` | `uuid` → `prayer_topics.id` | nullable |
| `location` | `text` | nullable |
| `theme` | `text` | nullable |
| `status` | `planning_status` | `DRAFT` \| `CONFIRMED` \| `COMPLETED` \| `CANCELLED`, défaut `DRAFT` |
| `notes` | `text` | nullable |

Index : `slot_date`, `prayer_leader_id`, `secondary_leader_id`, `prayer_topic_id`, `status`.

> `planning` a deux clés étrangères vers `profiles` (`prayer_leader_id` et
> `secondary_leader_id`) : toute requête PostgREST qui charge les deux relations en même temps doit
> lever l'ambiguïté avec des indices explicites, ex. `profiles!planning_prayer_leader_id_fkey(...)`
> et `profiles!planning_secondary_leader_id_fkey(...)` — voir
> `src/features/planning/queries/planning.queries.ts`.

### `reports`

Un compte rendu par créneau (`planning_id` unique) — reproduit le déroulé réel d'une
chaîne de prière de l'EJP, pas un rapport de réunion générique (voir
[`REPORTS.md`](./REPORTS.md) pour le modèle métier complet). Posée par
`20260728100005_reports.sql` puis étendue par `20260731090001_reports_details.sql`.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `planning_id` | `uuid` → `planning.id`, **unique** | 1 CR maximum par créneau |
| `prayer_leader_id` | `uuid` → `profiles.id` | conducteur assigné au créneau |
| `created_by` | `uuid` → `profiles.id` | auteur réel du CR (peut différer du conducteur) |
| `status` | `report_status` | `DRAFT` \| `SUBMITTED` \| `VALIDATED` \| `REJECTED` |
| `session_date` | `date` | préremplie depuis `planning.slot_date`, modifiable |
| `session_start_time` / `session_end_time` | `time` | préremplies depuis `planning`, modifiables |
| `connected_count` | `integer` | nullable, `>= 0` — « Nombre de personnes connectées » |
| `has_instrumental` | `boolean` | |
| `thanksgiving` | `jsonb` | Actions de grâce (ouverture) — `[{id, reference}]` |
| `holy_spirit_invitation` | `jsonb` | Invitation du Saint-Esprit — `[{id, reference}]` |
| `prayer_points` | `jsonb` | Points de prière — `[{id, title, references: [{id, reference}]}]`, ordre = ordre du tableau |
| `closing_thanksgiving` | `jsonb` | Fin / Actions de grâce (clôture) — `[{id, reference}]` |
| `announcements` | `text` | nullable — Annonces, texte libre |
| `submitted_at` | `timestamptz` | nullable — renseignée à la soumission uniquement |
| `validated_at` | `timestamptz` | nullable — renseignée automatiquement lors du passage à `VALIDATED` |
| `created_at` / `updated_at` | `timestamptz` | |

Index : `prayer_leader_id`, `status`, `created_by` (`planning_id` déjà indexé via la
contrainte unique).

> Les listes de références bibliques et les points de prière sont des structures
> imbriquées de taille variable (un point peut avoir un nombre illimité de versets) :
> stockées en `jsonb` plutôt que normalisées en tables filles, car ce contenu n'est
> jamais interrogé colonne par colonne — toujours lu et écrit comme un bloc par
> section. Voir [`REPORTS.md`](./REPORTS.md#stockage-supabase-des-listes-imbriquées).

### `report_comments`

Retour de suivi (principalement admin) sur un compte rendu — historique conservé
intégralement, jamais modifié ni supprimé unitairement.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `report_id` | `uuid` → `reports.id`, `on delete cascade` | |
| `author_id` | `uuid` → `profiles.id` | |
| `message` | `text` | |
| `created_at` | `timestamptz` | |

Index : `report_id`.

### `testimonies`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `author_id` | `uuid` → `profiles.id` | |
| `title` / `content` | `text` | |

Index : `author_id`, `created_at desc` (flux chronologique).

### `notifications`

Table métier du module **Notifications** (voir [`NOTIFICATIONS.md`](./NOTIFICATIONS.md)).
Posée par `20260728100007_notifications.sql` puis étendue par
`20260802090001_notifications_details.sql`.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` → `profiles.id`, `on delete cascade` | destinataire — une notification n'appartient jamais qu'à un seul utilisateur |
| `type` | `notification_type` | `PLANNING` \| `REPORT` \| `MEMBER` \| `PRAYER_TOPIC` \| `SYSTEM` — un préfixe par module producteur, pas un enum par événement exact (voir `title`/`message`) |
| `priority` | `notification_priority` | `LOW` \| `NORMAL` \| `HIGH` \| `URGENT`, défaut `NORMAL` |
| `title` / `message` | `text` | |
| `action_url` | `text` | nullable — lien vers l'élément concerné, ouvert par l'action « Consulter » (anciennement `link`) |
| `read_at` | `timestamptz` | nullable = non lue ; pas de colonne `is_read` séparée — le modèle TypeScript expose `isRead` comme un dérivé de `read_at`, une seule source de vérité |

Index : `(user_id, read_at)`, `type`, `priority`.

> La **génération automatique** des notifications (déclenchée par la soumission d'un CR, une
> nouvelle affectation Planning, une demande d'adhésion, etc.) reste à implémenter avec chaque
> module producteur — `NotificationService.notify(...)` (module Notifications) expose déjà l'API
> à appeler ; voir [`NOTIFICATIONS.md`](./NOTIFICATIONS.md#évolutions-futures) pour le choix entre
> appel direct (même acteur/destinataire) et trigger Postgres `security definer` (destinataire
> différent de l'acteur, ex. conducteur → admin).

### `app_settings`

Paramètres généraux de la plateforme — module **Administration** (voir [`ADMIN.md`](./ADMIN.md)).
Une seule ligne, garantie par un index unique sur une expression constante
(`(true)`) plutôt qu'un identifiant fixe imposé par l'application.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `platform_name` | `text` | défaut `'EJP Hub'` |
| `logo_url` | `text` | nullable |
| `description` | `text` | nullable |
| `timezone` | `text` | défaut `'Europe/Paris'` |
| `language` | `text` | défaut `'fr'` |
| `updated_by` | `uuid` → `profiles.id` | nullable |
| `updated_at` | `timestamptz` | maintenu par `set_updated_at()` |

> Pas encore branchée sur l'affichage réel (nom/logo du `Header`, voir
> `shared/components/layout/header.tsx`) — un futur sprint remplacera `APP_NAME`
> (`shared/constants/app.ts`) par une lecture de cette table.

### `admin_categories`

Listes configurables par module — module **Administration**. CRUD complet réservé aux
administrateurs.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `scope` | `admin_category_scope` | `PRAYER_TOPIC_CATEGORY` \| `MEETING_TYPE` — extensible, ajouter une valeur suffit pour un futur module |
| `label` | `text` | libellé affiché |
| `value` | `text` | valeur technique — unique par `scope` |
| `sort_order` | `integer` | ordre d'affichage |
| `created_at` / `updated_at` | `timestamptz` | |

Index : `(scope, sort_order)`.

> Le module Sujets de prière lit encore son propre enum Postgres
> `prayer_topic_category`, pas cette table (le seed reprend les mêmes valeurs pour rester
> cohérent visuellement) — câbler `prayer_topics` sur `admin_categories` est documenté
> dans [`ADMIN.md`](./ADMIN.md#évolutions-futures), pas fait dans ce sprint (ne modifie
> pas le module Sujets de prière).

### `admin_audit_log`

Journal des actions importantes de la plateforme — module **Administration**, lecture
seule pour les admins.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `actor_id` | `uuid` → `profiles.id`, `on delete set null` | utilisateur ayant effectué l'action (pas nécessairement un admin) |
| `action` | `text` | ex. « a validé un compte rendu » |
| `module` | `text` | module concerné (Membres, Comptes rendus, Planning…) |
| `target_label` | `text` | nullable — nom lisible de l'élément concerné |
| `created_at` | `timestamptz` | |

Index : `created_at desc`, `module`.

> Alimenté par des données de démonstration en mode mock. Le câblage réel (chaque
> module producteur y écrit à chaque action notable) est documenté dans
> [`ADMIN.md`](./ADMIN.md#évolutions-futures) — même choix d'architecture que pour
> `notifications` (trigger `security definer` ou appel serveur), pas fait dans ce sprint.

## Row Level Security

RLS activée sur les 6 tables dès leur création (`20260728100008_row_level_security.sql`). Principe
général :

- **Lecture** : ouverte à tout utilisateur authentifié pour les données partagées
  (`prayer_topics`, `planning`, `testimonies`), restreinte au propriétaire pour les données
  personnelles (`reports` — un conducteur ne voit que ses propres comptes rendus,
  `notifications` — chacun ne voit que les siennes).
- **Écriture** : réservée à `ADMIN` pour les données de référence (`prayer_topics`, `planning`),
  ouverte à l'auteur pour son propre contenu (`testimonies`, `reports` liés à ses créneaux).
- **Suppression** : réservée à `ADMIN`, sauf `notifications` (chacun supprime les siennes).

`notifications` déroge aussi à la règle d'écriture ci-dessus : l'insertion est ouverte à
`auth.uid() = user_id` (notification pour soi-même) ou à un `ADMIN` (pour n'importe qui) — voir
`20260802090001_notifications_details.sql` et [`NOTIFICATIONS.md`](./NOTIFICATIONS.md).

Les trois tables du module Administration (`app_settings`, `admin_categories`,
`admin_audit_log`, posées par `20260803090001_admin_details.sql`) suivent une règle plus stricte
encore : **aucune** opération, y compris la lecture, n'est ouverte à autre chose qu'un `ADMIN` —
voir [`ADMIN.md`](./ADMIN.md#permissions).

La fonction `public.is_admin()` (definer, `stable`) centralise la vérification de rôle utilisée par
toutes les policies — elle est la seule chose à auditer pour comprendre « qui est admin » côté base
de données.

## Storage

Un bucket public `avatars` est créé par `20260728100009_storage.sql`, avec des policies restreignant
l'écriture à `avatars/<user_id>/...` (premier segment du chemin = l'UUID de l'utilisateur).

## Seed

`scripts/seed.ts` (exécuté via `npm run db:seed`) crée, via l'API Admin de Supabase (clé
`service_role`, mots de passe hachés comme en production) :

| Rôle | E-mail |
| --- | --- |
| `ADMIN` | `admin@ejp-hub.test` |
| `PRAYER_LEADER` | `conducteur1@ejp-hub.test` |
| `PRAYER_LEADER` | `conducteur2@ejp-hub.test` |

Mot de passe commun affiché dans la sortie de la commande (développement uniquement — ne jamais
réutiliser en production). Le script est idempotent : le relancer sur des comptes déjà créés affiche
un avertissement au lieu d'échouer.

## Régénérer les types TypeScript

Une fois le projet lié (`supabase link`) :

```bash
npx supabase gen types typescript --local > src/shared/types/database.ts
```

`src/shared/types/database.ts` est actuellement écrit à la main, en miroir exact des migrations —
à remplacer par cette commande dès qu'un projet Supabase réel est disponible pour l'équipe.

## Ajouter une table

1. `npx supabase migration new <nom>` (ou créer le fichier à la main dans `supabase/migrations/`
   avec un horodatage supérieur au dernier).
2. Écrire le DDL (table, index, trigger `set_updated_at` si elle a un `updated_at`).
3. Ajouter les policies RLS correspondantes.
4. Mettre à jour `src/shared/types/database.ts` (ou régénérer, voir ci-dessus).
