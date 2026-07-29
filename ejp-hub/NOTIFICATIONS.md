# Notifications

Le module Notifications centralise tous les événements importants de la plateforme :
chaque utilisateur dispose d'un centre de notifications personnel (`/notifications`),
accessible aussi via l'icône cloche du Header. Ce document explique l'architecture, le
modèle métier, le flux de données et les décisions de conception — le
[`README.md`](./src/features/notifications/README.md) du module renvoie ici pour le
détail.

## Modèle métier

```ts
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;         // PLANNING | REPORT | MEMBER | PRAYER_TOPIC | SYSTEM
  priority: NotificationPriority; // LOW | NORMAL | HIGH | URGENT
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
}
```

Deux choix méritent d'être expliqués :

- **`isRead` est un dérivé de `readAt`, pas une colonne séparée.** Le brief liste `is_read`
  parmi les champs du modèle, mais ajouter une colonne booléenne redondante avec
  `read_at` (déjà présente depuis le Sprint 2) créerait deux sources de vérité à
  maintenir en synchronisation. `NotificationMapper.toNotification` calcule
  `isRead: row.read_at !== null` une seule fois ; tous les composants ne connaissent que
  ce booléen.
- **`type` est un préfixe par module producteur, pas un enum par événement exact.**
  `PLANNING`/`REPORT`/`MEMBER`/`PRAYER_TOPIC`/`SYSTEM` couvrent respectivement « nouvelle
  affectation, créneau modifié/supprimé, rappel », « brouillon enregistré, CR soumis/
  validé/rejeté », « demande reçue/acceptée/refusée, changement de rôle, suspension »,
  « sujet publié/modifié » et « maintenance, mise à jour » — la section 6 du brief liste
  20 événements précis, mais `title`/`message` portent déjà le détail exact de chacun. Un
  enum avec 20 valeurs (et qui continuerait de grossir à chaque nouvel événement) serait
  plus difficile à maintenir qu'un badge de couleur générique par type, pour un bénéfice
  nul : aucun composant n'a besoin de distinguer « CR validé » de « CR rejeté »
  autrement que par leur texte.

## Flux de données

```
NotificationsView (page /notifications)          NotificationBell (Header)
   │                                                  │
   ├─ useNotifications()   ──► NotificationService.list(context) ──► Repository (mock | Supabase)
   ├─ useNotificationStats()  (pur, dérivé du cache : non lues, aujourd'hui, cette semaine, par type)
   ├─ useNotificationsFilters()  (pur, en mémoire : recherche, type, priorité, lu/non lu, période)
   ├─ useNotificationsView()  (localStorage : Liste groupée / Tableau)
   │
   ├─ NotificationStats, NotificationTypeBreakdownChart (Recharts, lazy)
   ├─ NotificationFilters
   ├─ NotificationList (groupée par date) | NotificationTable (TanStack Table)
   └─ use-notification-mutations (markRead/markAllRead/remove/notify)
          └─ NotificationService ──► Repository ──► invalidation React Query
```

Aucun composant n'appelle Supabase (ni même `NotificationRepository`) directement : tout
passe par `NotificationService`, qui choisit l'implémentation au moment de l'appel :

```ts
function getRepository(): NotificationRepository {
  return isSupabaseConfigured() ? SupabaseNotificationRepository : MockNotificationRepository;
}
```

## Isolation — plus stricte qu'ailleurs

Contrairement à Comptes rendus ou Membres, où un `ADMIN` voit l'ensemble des données,
**une notification reste strictement personnelle pour tout le monde, y compris un
administrateur** : `ADMIN` « voit toutes ses notifications » (les siennes), pas celles
des autres. `MockNotificationRepository.list` filtre donc uniquement sur
`userId === context.userId`, sans jamais de dérogation par rôle — et côté Supabase, la
RLS (`notifications_select_own`, `_update_own`, `_delete_own`) applique exactement la
même règle, sans policy « ou admin ». `NotificationListContext.role` existe malgré tout
dans le contrat, par cohérence avec les autres `*ListContext` du projet et pour une
évolution future, mais aucune méthode du repository ne le lit aujourd'hui — voir
`utils/notification-permissions.ts`, volontairement symétrique entre les deux rôles.

## Écriture — pourquoi l'insertion réelle a des limites (aujourd'hui)

La table `notifications` n'avait jusqu'ici **aucune** policy d'écriture : seules la
lecture et la mise à jour de `read_at` étaient possibles. Ce module ajoute :

- `notifications_insert_self_or_admin` : un utilisateur peut créer une notification pour
  lui-même, ou un `ADMIN` pour n'importe qui — couvre les cas déjà réels (rappel
  personnel, diffusion système) sans policy dangereusement permissive.
- `notifications_delete_own` : chacun supprime les siennes.

Ce que cette policy **ne couvre pas** : un conducteur qui soumet un compte rendu ne peut
pas, avec sa propre session, créer une notification pour l'administrateur (acteur ≠
destinataire, ni l'un ni l'autre n'est admin). Câbler la génération automatique
inter-rôles (« CR soumis → notifier l'admin », « demande d'adhésion → notifier les
admins ») nécessite l'une de ces deux approches, à choisir lors de l'intégration de
chaque module producteur :

1. **Trigger Postgres `security definer`** sur la table source (`reports`, `planning`,
   `profiles`, `prayer_topics`) qui insère directement dans `notifications`, en
   contournant la RLS — l'approche la plus robuste, indépendante de l'appelant
   applicatif.
2. **Appel serveur avec la clé de service** depuis la Server Action du module producteur
   (même schéma que `features/members/actions/create-membership-request.action.ts`).

Aucune des deux n'est câblée dans ce sprint — la consigne était de « préparer » cette
architecture, pas de modifier Reports/Planning/Membres/Sujets de prière pour qu'ils
appellent réellement `NotificationService.notify(...)`. C'est le travail du prochain
sprint qui touchera chacun de ces modules.

## `NotificationService.notify(...)` — l'API prête pour les autres modules

```ts
await NotificationService.notify({
  userId: targetUserId,
  type: "REPORT",
  priority: "NORMAL",
  title: "Compte rendu validé",
  message: "Votre compte rendu a été validé.",
  actionUrl: "/comptes-rendus/report-1",
});
```

`NotificationValidationService.assertValidInput` (Zod, `validation/create-notification.schema.ts`)
valide la forme avant tout accès au dépôt — un futur appelant qui se trompe de type ou
oublie un champ obtient un message clair immédiatement plutôt qu'une erreur de
contrainte SQL. Aucun appelant n'existe encore ailleurs dans l'application.

## Mode démo — une limitation assumée

Le Dashboard conserve sa propre requête de notifications (`dashboard.queries.ts`,
`dashboard.mocks.ts`, `hooks/use-notifications.ts` local au Dashboard) plutôt que de
réutiliser les hooks internes du module Notifications — cohérent avec le reste du
Dashboard, dont chaque section (`RecentTopicsSection`, `UpcomingSlotsSection`…)
interroge directement les tables partagées via ses propres requêtes plutôt que
d'importer les internes des modules dédiés (`features/prayer-topics`, `features/planning`…).
En mode démo, cela signifie que le panneau Notifications du Dashboard et le centre
`/notifications` tiennent chacun leur propre tableau en mémoire : marquer une
notification lue dans l'un ne se reflète pas dans l'autre tant que la page n'est pas
rechargée. Une fois Supabase connecté, les deux interrogent la même table réelle — le
problème disparaît de lui-même.

## Composants

| Composant | Rôle |
| --- | --- |
| `NotificationBell` | Icône du Header — compteur non lus, menu déroulant |
| `NotificationDropdown` | Contenu du menu déroulant — aperçu des dernières notifications, lien vers le centre |
| `NotificationStats` | Indicateurs — non lues, aujourd'hui, cette semaine |
| `NotificationTypeBreakdownChart` | Répartition par type (Recharts, lazy) |
| `NotificationFilters` | Recherche + filtres combinables (type, priorité, lu/non lu, période) |
| `NotificationList` | Vue liste groupée chronologiquement (Aujourd'hui/Hier/Cette semaine/Plus ancien) |
| `NotificationTable` | Vue tableau (TanStack Table) — alternative à `NotificationList` |
| `NotificationCard` | Carte d'une notification — icône, titre, message, date, priorité, statut, actions |
| `NotificationPriorityBadge`, `NotificationTypeBadge`, `NotificationEmptyState` | Briques de présentation réutilisables |

## Services

| Service | Rôle |
| --- | --- |
| `NotificationRepository` (interface) | Contrat CRUD (hors création — voir `notify`) |
| `MockNotificationRepository` / `SupabaseNotificationRepository` | Implémentations, choisies par `NotificationService` |
| `NotificationService` | API publique consommée par les hooks — et par les futurs modules appelants (`notify`) |
| `NotificationValidationService` | Validation Zod de `notify(...)` |

## Évolutions futures

1. Câbler `NotificationService.notify(...)` (ou un trigger Postgres) depuis Planning,
   Comptes rendus, Membres et Sujets de prière pour chacun des 20 événements listés dans
   le brief — voir la section « Écriture » ci-dessus pour le choix d'architecture.
2. Notifications temps réel (Supabase Realtime sur `notifications`) pour rafraîchir le
   compteur du `NotificationBell` sans dépendre du `staleTime` de React Query.
3. Préférences utilisateur (désactiver un type de notification, résumé quotidien par
   e-mail).
4. Pagination serveur si le volume par utilisateur devient important (`NotificationTable`
   pagine déjà côté client, suffisant tant que `queryAllNotifications` reste borné).

## Prochaine étape : connexion Supabase réelle

1. Lier le projet (`supabase link`) et appliquer les migrations (voir `SUPABASE_SETUP.md`).
2. Régénérer `src/shared/types/database.ts` (`supabase gen types typescript`).
3. Aucun changement dans `features/notifications/components/` ni `hooks/` :
   `NotificationService` bascule automatiquement sur `SupabaseNotificationRepository` dès
   que `isSupabaseConfigured()` répond `true`.
4. Vérifier les policies RLS de `notifications` (déjà posées, restreignant chaque
   opération au propriétaire, avec la seule exception `ADMIN` à l'insertion).
