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

Ce que cette policy **ne couvrait pas** : un conducteur qui soumet un compte rendu ne peut
pas, avec sa propre session, créer une notification pour l'administrateur (acteur ≠
destinataire, ni l'un ni l'autre n'est admin). C'est câblé depuis
`20260806090001_notification_triggers.sql` via des **triggers Postgres `security
definer`** sur les tables source (`reports`, `planning`, `profiles`) — l'approche
retenue plutôt qu'un appel serveur applicatif : elle capture tout chemin d'écriture (y
compris `db:seed` ou une requête SQL manuelle), pas seulement les hooks React de
l'application.

| Table | Événement | Destinataire |
| --- | --- | --- |
| `profiles` | Nouvelle demande d'adhésion (`insert ... status = 'PENDING'`) | Tous les `ADMIN` actifs |
| `profiles` | Décision (`PENDING` → `ACTIVE`/`REFUSED`) | Le demandeur |
| `reports` | Soumission (`status = 'SUBMITTED'`) | Tous les `ADMIN` actifs |
| `reports` | Décision (`SUBMITTED` → `VALIDATED`/`REJECTED`) | L'auteur (`created_by`) |
| `planning` | Assignation (création ou changement de conducteur) | Le conducteur assigné **et** tous les `ADMIN` actifs |
| `planning` | Changement d'horaire ou annulation | Le conducteur principal |
| `planning` (relance quotidienne, `pg_cron`) | Créneau passé sans compte rendu | Le conducteur assigné, chaque jour tant qu'aucun compte rendu n'existe |

`prayer_topics` reste volontairement en dehors : un nouveau sujet n'a pas de destinataire
personnel évident (ce serait une diffusion à tous les utilisateurs) — à revisiter si le
besoin se confirme.

### Relance quotidienne des comptes rendus (`20260809090001_report_reminders.sql`)

Le déclencheur d'assignation notifie le conducteur (et désormais l'admin) **dès
l'assignation** — mais l'assignation peut avoir lieu plusieurs jours avant que le créneau
n'ait réellement eu lieu, donc rappeler seulement à ce moment-là ne suffit pas. Une tâche
planifiée (`pg_cron`, `send_report_reminders()`, tous les jours à 8h UTC) parcourt les
créneaux passés (`slot_date < aujourd'hui`), non annulés, sans compte rendu associé, et
crée une notification `REPORT`/`HIGH` pour le conducteur à chaque exécution où aucune
notification identique n'a déjà été créée le jour même (déduplication par
titre+message+destinataire+date). Contrairement aux triggers d'assignation, c'est donc une
relance **récurrente**, pas un événement ponctuel — jusqu'à ce que le compte rendu soit
soumis. `select public.send_report_reminders();` permet de la déclencher manuellement pour
tester sans attendre l'horaire planifié.

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

## Notifications push (Web Push) {#push}

Chaque notification créée en base (par les triggers ci-dessus) peut aussi arriver comme
une vraie notification système sur le téléphone/ordinateur de son destinataire — même
application fermée. Architecture, du plus proche de l'utilisateur au plus proche de la
base :

1. **Service Worker** (`public/sw.js`) : enregistré une fois par appareil
   (`ServiceWorkerRegistration`, monté dans `AppShell`). Écoute l'événement `push` et
   affiche la notification système ; gère le clic dessus (ouvre/focus l'app sur
   `actionUrl`).
2. **Abonnement** (`push_subscriptions`) : depuis `/notifications`
   (`PushNotificationToggle`), l'utilisateur active les notifications sur *cet appareil
   précis* — `Notification.requestPermission()` puis
   `registration.pushManager.subscribe(...)`, stocké dans `push_subscriptions` (RLS :
   chacun ne gère que ses propres abonnements). Un appareil = un abonnement ; activer sur
   son téléphone n'active pas automatiquement l'ordinateur.
3. **Déclenchement** : un **Database Webhook Supabase** (table `notifications`, événement
   `INSERT`) appelle `POST /api/push/send` à chaque nouvelle ligne.
4. **Envoi** (`src/app/api/push/send/route.ts`) : vérifie un secret partagé
   (`PUSH_WEBHOOK_SECRET`, l'appelant est Supabase, pas un utilisateur connecté), lit les
   abonnements du destinataire avec la clé de service, envoie via `web-push` (clés VAPID).
   Un abonnement expiré (404/410) est supprimé automatiquement.

### iOS : une limite d'Apple, pas de l'application

Safari n'expose l'API Push que si le site a été **ajouté à l'écran d'accueil**
(Partager → « Sur l'écran d'accueil ») — impossible de l'activer depuis un simple onglet
Safari. `PushNotificationToggle` l'explique directement si `PushManager` est absent.
Android/Chrome n'a pas cette contrainte.

### Mise en place (à faire une fois, après les migrations SQL habituelles)

1. Générer une paire de clés VAPID (`npx web-push generate-vapid-keys`) et un secret
   aléatoire pour `PUSH_WEBHOOK_SECRET` (ex. `openssl rand -hex 32`).
2. Ajouter dans Vercel (Project Settings → Environment Variables) :
   `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `PUSH_VAPID_SUBJECT`
   (`mailto:...`), `PUSH_WEBHOOK_SECRET` — voir `.env.example`.
3. Déclencher l'appel à chaque nouvelle notification — deux options :
   - **Dashboard** (Database → Webhooks → Create a new hook, table `notifications`,
     événement `Insert`, URL `https://<domaine>/api/push/send`, header
     `x-webhook-secret`) si le schéma interne `supabase_functions` existe sur le projet.
   - **SQL direct** (`20260808090001_push_trigger.sql`) sinon — rencontré en pratique sur
     ce projet (« schema "supabase_functions" does not exist »). Un trigger `security
     definer` appelle `net.http_post` (extension `pg_net`) directement, sans dépendre du
     dashboard. L'URL et le secret y sont en dur : à mettre à jour manuellement si le
     domaine ou le secret changent.

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
| `PushNotificationToggle` | Active/désactive les notifications push sur l'appareil courant (voir [Push](#push)) |
| `ServiceWorkerRegistration` | Enregistre `/sw.js`, monté une fois dans `AppShell` — ne rend rien |

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
