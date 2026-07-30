# Planning

Le Planning est le **moteur de planification** d'EJP Hub : les comptes rendus, notifications et
statistiques du tableau de bord dépendront tous, à terme, des créneaux (`PrayerSlot`) qu'il gère.
Ce document explique l'architecture du module, le flux de données et les décisions de conception —
le [`README.md`](./src/features/planning/README.md) du module renvoie ici pour le détail.

## Modèle métier

```ts
interface PrayerSlot {
  id: string;
  title: string;
  description?: string;
  date: string;            // YYYY-MM-DD
  startTime: string;        // HH:mm
  endTime: string;
  location?: string;
  primaryLeader: PlanningParticipant;
  secondaryLeader?: PlanningParticipant;
  status: PlanningStatus;   // DRAFT | CONFIRMED | COMPLETED | CANCELLED
  theme?: string;
  prayerTopic?: PlanningPrayerTopicRef;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

`PlanningStatus` mappe directement l'enum Postgres `planning_status` ajouté par la migration
`supabase/migrations/20260729090001_planning_details.sql` (voir [`DATABASE.md`](./DATABASE.md#planning)).

## Quatre vues, un seul jeu de données

| Vue | Rendu | Cas d'usage |
| --- | --- | --- |
| **Calendrier** | FullCalendar, vue `multiMonth` (3 mois) | Vue d'ensemble trimestrielle |
| **Semaine** | FullCalendar, `timeGridWeek` | Planification fine, horaires visibles |
| **Mois** | FullCalendar, `dayGridMonth` | Vue mensuelle classique |
| **Liste** | TanStack Table | Recherche, tri, export, usage tactile/mobile |

Les quatre vues consomment les mêmes créneaux filtrés (`usePlanningSlots` + `applyPlanningFilters`)
— seul le composant de rendu change. Le choix de vue est persisté dans `localStorage`
(`usePlanningView`, clé `ejp-hub:planning:view`) pour rester stable d'une session à l'autre.

## Flux de données

```
PlanningView (page)
   │
   ├─ usePlanningSlots()            ──► PlanningService.list() ──► Repository (mock | Supabase)
   ├─ usePlanningFilters()          ──► applyPlanningFilters()   (pur, en mémoire)
   ├─ usePlanningView()             ──► localStorage
   │
   ├─ PlanningTable | PlanningCalendar   (rendu des créneaux filtrés)
   ├─ PlanningFilters                    (met à jour les filtres)
   ├─ PlanningDialog → PlanningForm       (création/édition, Zod)
   │      └─ usePlanningConflicts()  ──► PlanningConflictService (pur, sur les données déjà en cache)
   └─ use-planning-mutations (create/update/reschedule/cancel/delete/duplicate)
          └─ PlanningService ──► Repository ──► invalidation React Query
```

Aucun composant n'appelle Supabase (ni même `PlanningRepository`) directement : tout passe par
`PlanningService`, qui choisit l'implémentation au moment de l'appel :

```ts
function getRepository(): PlanningRepository {
  return isSupabaseConfigured() ? new SupabasePlanningRepository() : new MockPlanningRepository();
}
```

## Mode démo

Tant qu'aucun projet Supabase n'est configuré, `MockPlanningRepository` tient un tableau mutable
en mémoire (`INITIAL_MOCK_SLOTS`, 8 créneaux fictifs couvrant passé/présent/futur et tous les
statuts) : créer, modifier, dupliquer, annuler, supprimer et glisser-déposer un créneau fonctionnent
réellement, sans écrire dans une base. `SupabasePlanningRepository` implémente exactement la même
interface (`PlanningRepository`) via les requêtes de `queries/planning.queries.ts` — brancher un
vrai projet Supabase ne change qu'une ligne (`getRepository`), aucun composant à toucher.

### Point d'attention Supabase : deux relations vers `profiles`

`planning` a deux clés étrangères vers `profiles` (`prayer_leader_id` et `secondary_leader_id`).
PostgREST refuse une jointure ambiguë si les deux relations sont demandées sans précision — d'où les
indices explicites dans `PLANNING_SELECT` :

```ts
profiles!planning_prayer_leader_id_fkey(id, firstname, lastname, avatar_url),
profiles!planning_secondary_leader_id_fkey(id, firstname, lastname, avatar_url)
```

## Détection de conflits

`PlanningConflictService` calcule trois types de conflits, en pur JavaScript sur les créneaux déjà
chargés (aucun appel réseau à chaque frappe) :

- **Créneau invalide** : heure de fin ≤ heure de début.
- **Double réservation de lieu** : deux créneaux au même lieu avec chevauchement horaire.
- **Conducteur en conflit** : un conducteur (principal ou secondaire) déjà affecté à un autre
  créneau chevauchant.

`usePlanningConflicts(candidate, editingSlotId)` relie ce service au formulaire : les valeurs
observées (`watch()`) sont recalculées à chaque changement et les conflits s'affichent en direct,
sans bloquer la soumission (avertissement, pas une erreur de validation Zod).

## Programmes

Un 5e onglet (« Programmes », à côté de Calendrier/Semaine/Mois/Liste) regroupe certains créneaux
et une équipe de conducteurs dédiée — ex. « Programme Jeunesse ». Un membre peut appartenir à
plusieurs programmes ; un créneau appartient à zéro ou un seul programme (`planning.program_id`,
nullable). L'appartenance à un programme est une liste assignée explicitement par un
administrateur (`program_members`), jamais déduite des créneaux existants.

Il n'existe pas de vue calendrier/liste dupliquée pour un programme : le bouton « Voir le
planning » d'une carte programme règle simplement le filtre général `programId` et bascule sur
l'onglet Liste — le Planning général et « le planning de ce programme » sont la même UI, juste
filtrée différemment. Voir `DATABASE.md#programs` pour le schéma.

## Réponse à l'assignation & remplacements

Un conducteur assigné (principal **ou** secondaire) peut accepter ou refuser son assignation,
avec un commentaire libre — visible dans le détail du créneau (`AssignmentResponsePanel`), sous
les informations générales. La décision reste **modifiable à tout moment** (les boutons
Accepter/Refuser restent actifs après une première réponse) ; réassigner le créneau à quelqu'un
d'autre remet automatiquement sa réponse à `PENDING` (voir le trigger
`manage_planning_assignment_response`, `DATABASE.md#planning`).

Plutôt que de simplement refuser, un conducteur peut aussi **signaler un remplacement** : il
propose un membre précis (`planning_replacement_requests`), avec un commentaire optionnel.
Un administrateur voit la demande dans ce même panneau et l'approuve ou la refuse :

- **Approuvée** → le créneau est réellement réassigné au membre proposé (même mécanique que
  changer le conducteur depuis le formulaire — nouvelle notification, réponse remise à `PENDING`).
- **Refusée** → rien ne change sur le créneau ; le demandeur est notifié du refus.

Chaque réponse (accepter/refuser) et chaque demande de remplacement déclenche une notification —
voir `NOTIFICATIONS.md` pour le détail des événements et destinataires.

## Permissions

`getPlanningPermissions(role)` centralise les droits — aucun `role === "ADMIN"` dispersé dans les
composants :

| Droit | `ADMIN` | `PRAYER_LEADER` |
| --- | --- | --- |
| Créer / modifier / dupliquer / annuler / supprimer | ✅ | ❌ (lecture seule) |
| Glisser-déposer / redimensionner dans le calendrier | ✅ | ❌ |
| Consulter (calendrier, liste, détail) | ✅ | ✅ |
| Exporter en CSV | ✅ | ✅ |
| Importer des créneaux depuis un CSV | ✅ | ❌ (aligné sur le droit de créer) |
| Consulter les programmes | ✅ | ✅ |
| Créer / modifier / supprimer un programme | ✅ | ❌ |
| Accepter/refuser sa propre assignation, signaler un remplacement | — | ✅ (si assigné) |
| Approuver/refuser une demande de remplacement | ✅ | ❌ |

## Composants

| Composant | Rôle |
| --- | --- |
| `PlanningHeader` | En-tête de page, bouton « Nouveau créneau » gated par permission |
| `PlanningToolbar` | Bascule entre les 4 vues + export/import CSV |
| `PlanningImportDialog` | Modèle CSV à télécharger, lecture du fichier, import ligne par ligne avec résumé des erreurs |
| `PlanningFilters` | Filtres combinables (recherche, dates, conducteur, lieu, statut, sujet) |
| `PlanningCalendar` | FullCalendar (Calendrier/Semaine/Mois), drag & drop, resize |
| `PlanningTable` | TanStack Table (vue Liste) : tri, pagination, colonnes masquables |
| `PlanningDialog` | Bascule consultation / création / édition dans une même modale |
| `PlanningForm` | Formulaire Zod, délègue conducteurs (`PlanningFormLeaderFields`) et conflits (`PlanningConflictWarning`) |
| `PlanningCard`, `PlanningEvent`, `PlanningStatusBadge`, `PlanningEmptyState` | Briques de présentation réutilisées par le calendrier, la liste et le tableau de bord |
| `ProgramsTab` | Onglet Programmes : cartes + création/modification/suppression |
| `ProgramCard` | Une carte programme (description, équipe, raccourci « Voir le planning ») |
| `ProgramForm` | Formulaire Zod : nom, description, équipe (cases à cocher sur les conducteurs) |
| `AssignmentResponsePanel` | Réponse à l'assignation (badges, accepter/refuser, commentaire) + demandes de remplacement, dans le détail d'un créneau |

## Services

| Service | Rôle |
| --- | --- |
| `PlanningRepository` (interface) | Contrat CRUD + options (conducteurs, lieux, sujets, programmes) + `respondToAssignment` |
| `MockPlanningRepository` / `SupabasePlanningRepository` | Implémentations, choisies par `PlanningService` |
| `PlanningService` | API publique consommée par les hooks (seul point d'entrée) |
| `ReplacementRequestRepository` (interface) | Contrat CRUD des demandes de remplacement |
| `MockReplacementRequestRepository` / `SupabaseReplacementRequestRepository` | Implémentations, choisies par `ReplacementRequestService` |
| `ReplacementRequestService` | API publique consommée par les hooks — création, décision admin, annulation |
| `PlanningConflictService` | Détection de conflits, pur et testable |
| `PlanningExportService` | Export CSV (Blob + `URL.createObjectURL`) |
| `PlanningImportService` | Parse un CSV (`shared/utils/csv.ts`), reconnaît les conducteurs par nom complet, valide chaque ligne avec `planningSlotSchema` — une ligne invalide est écartée et signalée, jamais bloquante pour les autres |
| `ProgramRepository` (interface) / `MockProgramRepository` / `SupabaseProgramRepository` | Contrat CRUD des programmes, choisies par `ProgramService` |
| `ProgramService` | API publique des programmes (liste, création, modification, suppression) |

## Prochaine étape : connexion Supabase réelle

1. Lier le projet (`supabase link`) et appliquer les migrations (voir `SUPABASE_SETUP.md`).
2. Régénérer `src/shared/types/database.ts` (`supabase gen types typescript`).
3. Aucun changement dans `features/planning/components/` ni `hooks/` : `PlanningService` bascule
   automatiquement sur `SupabasePlanningRepository` dès que `isSupabaseConfigured()` répond `true`.
4. Vérifier les policies RLS de `planning` (déjà posées en Sprint 2, restreignant l'écriture à
   `ADMIN` — cohérent avec `getPlanningPermissions`).
