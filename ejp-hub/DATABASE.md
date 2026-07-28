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
profiles ──────────────┬──────────────┬──────────────┐
   │ created_by        │ prayer_leader_id             │ author_id
   ▼                    ▼                              ▼
prayer_topics ◄─── planning ──── reports        testimonies
                       │ 1:1 (planning_id)
                       ▼
                    reports

notifications (user_id → profiles)
```

### `profiles`

Étend `auth.users` avec les informations applicatives. Créé automatiquement par le trigger
`handle_new_user` à chaque inscription (voir `20260728100002_profiles.sql`).

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | = `auth.users.id` |
| `firstname` | `text` | |
| `lastname` | `text` | |
| `email` | `text` | unique |
| `role` | `user_role` | `ADMIN` \| `PRAYER_LEADER`, défaut `PRAYER_LEADER` |
| `avatar_url` | `text` | nullable |
| `phone` | `text` | nullable |
| `is_active` | `boolean` | défaut `true` |
| `created_at` / `updated_at` | `timestamptz` | `updated_at` maintenu par `set_updated_at()` |

**Sécurité** : le trigger `prevent_privilege_escalation` empêche un utilisateur non-`ADMIN` de
modifier `role` ou `is_active` — y compris le sien. Seul un `ADMIN` (ou la clé `service_role`, donc
`scripts/seed.ts`) peut changer ces deux colonnes.

Index : `role`, `is_active`.

### `prayer_topics`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `title` | `text` | |
| `description` | `text` | nullable |
| `priority` | `topic_priority` | `LOW` \| `MEDIUM` \| `HIGH` |
| `start_date` / `end_date` | `date` | `end_date` nullable, `end_date >= start_date` |
| `status` | `topic_status` | `ACTIVE` \| `ARCHIVED` |
| `created_by` | `uuid` → `profiles.id` | |

Index : `status`, `priority`, `created_by`.

### `planning`

Créneaux de prière assignés à un conducteur.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `slot_date` | `date` | |
| `start_time` / `end_time` | `time` | `end_time > start_time` |
| `prayer_leader_id` | `uuid` → `profiles.id` | nullable (créneau non encore assigné) |
| `prayer_topic_id` | `uuid` → `prayer_topics.id` | nullable |
| `location` | `text` | nullable |
| `notes` | `text` | nullable |

Index : `slot_date`, `prayer_leader_id`, `prayer_topic_id`.

### `reports`

Un compte rendu par créneau (`planning_id` unique).

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `planning_id` | `uuid` → `planning.id`, **unique** | 1 CR maximum par créneau |
| `prayer_leader_id` | `uuid` → `profiles.id` | |
| `attendees_count` | `integer` | nullable, `>= 0` |
| `topics_covered` | `text` | nullable |
| `content` | `text` | |
| `follow_up` | `text` | nullable |

Index : `prayer_leader_id` (`planning_id` déjà indexé via la contrainte unique).

### `testimonies`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `author_id` | `uuid` → `profiles.id` | |
| `title` / `content` | `text` | |

Index : `author_id`, `created_at desc` (flux chronologique).

### `notifications`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` → `profiles.id`, `on delete cascade` | |
| `type` | `notification_type` | `UPCOMING_SLOT` \| `PENDING_REPORT` \| `NEW_TOPIC` |
| `title` / `message` | `text` | |
| `link` | `text` | nullable |
| `read_at` | `timestamptz` | nullable = non lue |

Index composite : `(user_id, read_at)`.

> La **génération** des notifications (déclenchée par la création d'un sujet, l'approche d'un
> créneau, etc.) sera implémentée avec chaque module concerné — cette migration ne pose que la
> structure.

## Row Level Security

RLS activée sur les 6 tables dès leur création (`20260728100008_row_level_security.sql`). Principe
général :

- **Lecture** : ouverte à tout utilisateur authentifié pour les données partagées
  (`prayer_topics`, `planning`, `testimonies`), restreinte au propriétaire pour les données
  personnelles (`reports` — un conducteur ne voit que ses propres comptes rendus,
  `notifications` — chacun ne voit que les siennes).
- **Écriture** : réservée à `ADMIN` pour les données de référence (`prayer_topics`, `planning`),
  ouverte à l'auteur pour son propre contenu (`testimonies`, `reports` liés à ses créneaux).
- **Suppression** : réservée à `ADMIN`, sauf `notifications` (pas de suppression, seulement marquage
  lu/non lu).

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
