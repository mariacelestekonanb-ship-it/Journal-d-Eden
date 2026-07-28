# Sujets de prière

Le module Sujets de prière centralise la création, l'organisation, la recherche et
l'archivage des sujets portés par la communauté. Comptes rendus et Planning s'y référeront
à terme (`prayer_topic_id` existe déjà sur `planning`, voir [`DATABASE.md`](./DATABASE.md)).
Ce document explique l'architecture, le flux de données et les décisions de conception — le
[`README.md`](./src/features/prayer-topics/README.md) du module renvoie ici pour le détail.

## Modèle métier

```ts
interface PrayerTopic {
  id: string;
  title: string;
  description: string | null;
  category: PrayerTopicCategory;   // CHURCH | FAMILY | YOUTH | EVANGELISM | HEALING | NATIONS | PERSONAL
  priority: PrayerTopicPriority;   // LOW | NORMAL | HIGH | URGENT
  status: PrayerTopicStatus;       // DRAFT | ACTIVE | COMPLETED | ARCHIVED
  startDate: string;                // YYYY-MM-DD
  endDate: string | null;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}
```

Ces trois enums mappent directement les types Postgres `prayer_topic_category`,
`prayer_topic_priority` et `prayer_topic_status` ajoutés par la migration
`supabase/migrations/20260730090001_prayer_topics_details.sql`, qui remplace les enums
d'origine (`topic_priority` LOW/MEDIUM/HIGH, `topic_status` ACTIVE/ARCHIVED) posés en Sprint 2 —
voir [`DATABASE.md`](./DATABASE.md#prayer_topics) pour le détail de la migration.

## Deux vues, un seul jeu de données

| Vue | Rendu | Cas d'usage |
| --- | --- | --- |
| **Cartes** | Grille responsive de `PrayerTopicCard` | Vue par défaut — parcourir, actions rapides visibles |
| **Liste** | TanStack Table | Tri multi-colonnes, sélection multiple, actions groupées |

Les deux vues consomment les mêmes sujets filtrés (`usePrayerTopics` + `applyPrayerTopicFilters`)
— seul le composant de rendu change. Le choix de vue est persisté dans `localStorage`
(`usePrayerTopicsView`, clé `ejp-hub:prayer-topics:view`), par défaut `"cards"`.

## Flux de données

```
PrayerTopicsView (page)
   │
   ├─ usePrayerTopics()              ──► PrayerTopicService.list() ──► Repository (mock | Supabase)
   ├─ usePrayerTopicsFilters()       ──► PrayerTopicSearchService.search()  (pur, en mémoire)
   ├─ usePrayerTopicStats()          ──► computePrayerTopicStats()          (pur, dérivé du cache)
   ├─ usePrayerTopicsBulkActions()   ──► sélection + PrayerTopicArchiveService.findExpiredTopics()
   ├─ usePrayerTopicsView()          ──► localStorage
   │
   ├─ PrayerTopicDashboardSection        (stats, évolution, derniers sujets)
   ├─ PrayerTopicTable | PrayerTopicGrid  (rendu des sujets filtrés)
   ├─ PrayerTopicFilters                  (met à jour les filtres)
   ├─ PrayerTopicDialog                   (création/édition, Zod)
   ├─ PrayerTopicDetailDrawer             (consultation, historique, actions rapides)
   └─ use-prayer-topic-mutations (create/update/delete/duplicate/archive/restore)
          └─ PrayerTopicService ──► Repository ──► invalidation React Query
```

Aucun composant n'appelle Supabase (ni même `PrayerTopicRepository`) directement : tout passe par
`PrayerTopicService`, qui choisit l'implémentation au moment de l'appel :

```ts
function getRepository(): PrayerTopicRepository {
  return isSupabaseConfigured() ? SupabasePrayerTopicRepository : MockPrayerTopicRepository;
}
```

## Mode démo

Tant qu'aucun projet Supabase n'est configuré, `MockPrayerTopicRepository` tient un tableau
mutable en mémoire (`INITIAL_MOCK_TOPICS`, 12 sujets fictifs couvrant les 7 catégories, les 4
priorités et les 4 statuts — dont un sujet volontairement expiré mais non archivé, pour démontrer
l'archivage automatique) : créer, modifier, dupliquer, archiver, restaurer et supprimer un sujet
fonctionnent réellement, sans écrire dans une base.

Le profil auteur (nécessaire pour attribuer un sujet à son créateur) vient de `useUser()`
(`@/features/auth/hooks/use-user`). Ce hook dépendait jusqu'ici d'une session Supabase réelle et
renvoyait toujours `profile: null` en mode démo — ce module étant le premier à en avoir besoin
côté client, `RoleProvider` a été complété pour retomber sur `MOCK_PROFILE` tant que Supabase
n'est pas configuré, exactement comme `resolveProfile()` le fait déjà côté serveur (voir
`src/features/auth/providers/role-provider.tsx`).

## Détection et archivage des sujets expirés

`PrayerTopicArchiveService` est un service pur qui détecte les sujets dont `endDate` est dépassée
et qui ne sont pas encore `ARCHIVED` (quel que soit leur statut actuel — un sujet `COMPLETED` ou
`ACTIVE` périmé reste un candidat légitime à l'archivage) :

```ts
PrayerTopicArchiveService.findExpiredTopics(topics: PrayerTopic[]): PrayerTopic[]
```

Le service ne modifie jamais les données lui-même : la barre d'outils affiche un bouton
« Archiver les N sujets expirés » (visible uniquement si `N > 0` et pour un rôle autorisé) qui
déclenche l'archivage réel via `useArchiveExpiredTopics()`.

## Recherche et filtres combinables

`PrayerTopicSearchService.search(topics, filters)` couvre le titre, la description, l'auteur et le
**libellé** de catégorie (pas seulement la valeur d'enum — chercher « jeunesse » trouve les sujets
`YOUTH`). Les filtres (catégorie, priorité, statut, auteur, période) sont tous combinables entre eux
et avec la recherche texte.

## Permissions

`getPrayerTopicPermissions(role)` centralise les droits :

| Droit | `ADMIN` | `PRAYER_LEADER` |
| --- | --- | --- |
| Créer / modifier / dupliquer / archiver / restaurer / supprimer | ✅ | ❌ (lecture seule) |
| Consulter (cartes, liste, détail) | ✅ | ✅ |
| Exporter en CSV | ✅ | ✅ |

`canCreate` est volontairement isolé des autres droits de lecture seule : le brief prévoit qu'un
conducteur de prière puisse un jour être autorisé à proposer des sujets — il suffira de faire
dépendre `canCreate` du rôle indépendamment du reste, sans toucher aux composants (aucun ne teste
`role === "ADMIN"` directement). Le menu d'actions rapides (`PrayerTopicCard`, colonnes de
`PrayerTopicTable`) affiche toujours au minimum « Consulter », même en lecture seule.

## Composants

| Composant | Rôle |
| --- | --- |
| `PrayerTopicHeader` | En-tête de page, liens Archives et « Nouveau sujet » (gated) |
| `PrayerTopicDashboardSection` | Indicateurs, graphique d'évolution (Recharts, chargé en lazy) et derniers sujets |
| `PrayerTopicToolbar` | Bascule Cartes/Liste, export CSV, actions groupées, archivage des expirés |
| `PrayerTopicFilters` | Recherche avancée + filtres combinables |
| `PrayerTopicTable` / `PrayerTopicGrid` | Les deux vues de la liste de sujets |
| `PrayerTopicDialog` | Création/édition (formulaire Zod) |
| `PrayerTopicDetailDrawer` | Consultation (Sheet) — détail, historique, actions rapides |
| `PrayerTopicCard`, `PrayerTopicStatusBadge`, `PrayerTopicPriorityBadge`, `PrayerTopicCategoryBadge`, `PrayerTopicTimeline`, `PrayerTopicEmptyState` | Briques de présentation réutilisables |

## Services

| Service | Rôle |
| --- | --- |
| `PrayerTopicRepository` (interface) | Contrat CRUD + archive/restore + options auteurs |
| `MockPrayerTopicRepository` / `SupabasePrayerTopicRepository` | Implémentations, choisies par `PrayerTopicService` |
| `PrayerTopicService` | API publique consommée par les hooks (seul point d'entrée) |
| `PrayerTopicArchiveService` | Détection des sujets expirés, pure et testable |
| `PrayerTopicSearchService` | Recherche et filtres combinables, pur et testable |

## Prochaine étape : connexion Supabase réelle

1. Lier le projet (`supabase link`) et appliquer les migrations (voir `SUPABASE_SETUP.md`).
2. Régénérer `src/shared/types/database.ts` (`supabase gen types typescript`).
3. Aucun changement dans `features/prayer-topics/components/` ni `hooks/` : `PrayerTopicService`
   bascule automatiquement sur `SupabasePrayerTopicRepository` dès que `isSupabaseConfigured()`
   répond `true`.
4. Vérifier les policies RLS de `prayer_topics` (déjà posées en Sprint 2, restreignant l'écriture à
   `ADMIN` — cohérent avec `getPrayerTopicPermissions`).
