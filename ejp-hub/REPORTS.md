# Comptes rendus

Le module Comptes rendus n'est pas un rapport de réunion générique : il reproduit
fidèlement le déroulé réel d'une chaîne de prière de l'EJP, dans l'ordre où elle se
vit — informations générales, actions de grâce, invitation du Saint-Esprit, points de
prière, fin/actions de grâce, annonces. Chaque créneau du Planning ne peut avoir qu'un
seul compte rendu (contrainte `unique` sur `planning_id` côté base). Ce document
explique le modèle métier, le flux de données et les décisions de conception — le
[`README.md`](./src/features/reports/README.md) du module renvoie ici pour le détail.

## Modèle métier

```ts
interface Report {
  id: string;
  planningSlot: ReportPlanningSlotRef;   // référence légère au créneau du Planning
  leader: ReportParticipant;             // conducteur assigné au créneau
  authorId: string;
  authorName: string;                    // auteur réel du CR (peut différer du conducteur)
  generalInfo: ReportGeneralInfo;
  thanksgiving: BibleReference[];        // Actions de grâce (ouverture)
  holySpiritInvitation: BibleReference[];// Invitation du Saint-Esprit
  prayerPoints: PrayerPoint[];           // Points de prière — nombre illimité
  closingThanksgiving: BibleReference[]; // Fin / Actions de grâce (clôture)
  announcements: string;                 // Annonces — texte libre
  status: ReportStatus;                  // DRAFT | SUBMITTED | VALIDATED | REJECTED
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  validatedAt: string | null;
}

interface ReportGeneralInfo {
  date: string;              // préremplie depuis le Planning, modifiable
  startTime: string;
  endTime: string;
  connectedCount: number | null;  // « Nombre de personnes connectées »
  hasInstrumental: boolean;
}

interface PrayerPoint {
  id: string;
  title: string;                  // le texte du point de prière
  references: BibleReference[];   // ses références bibliques associées
}

interface BibleReference {
  id: string;
  reference: string;              // ex. "Psaume 100:4"
}
```

Ce modèle remplace intégralement le premier jet générique du module (titre, résumé,
décisions, témoignages, difficultés, actions de suivi) : aucun de ces champs
n'appartient au déroulé réel d'une chaîne de prière, ils ont été retirés au profit des
six sections structurées ci-dessus.

## Ordre fixe des sections

Le formulaire (`ReportForm` → `ReportFormFields`) et la vue détail (`ReportSummary`)
partagent le même ordre, non réordonnable par l'utilisateur :

1. **Informations générales** — date, heures, personnes connectées, instrumental.
2. **Actions de grâce** — liste de références bibliques.
3. **Invitation du Saint-Esprit** — liste de références bibliques.
4. **Points de prière** — nombre illimité, chacun avec son propre texte et ses
   propres références.
5. **Fin / Actions de grâce** — liste de références bibliques.
6. **Annonces** — texte libre.

`ReportGeneralInfoFields` préremplit `date`/`startTime`/`endTime` depuis le créneau du
Planning choisi à la création (voir `ReportCreateView.handleCreateDraft`) ; le
conducteur reste libre de les corriger (la séance a pu démarrer en retard ou déborder).

## Listes réordonnables

`BibleReferenceListField` (réutilisé pour les trois listes de références et, imbriqué,
pour les références de chaque point de prière) et `ReportPrayerPointsField` partagent
le même modèle d'interaction, à la fois à la souris et au clavier :

- **glisser-déposer natif** (HTML5 `draggable`, sans dépendance supplémentaire) via la
  poignée `GripVertical` ;
- **boutons haut/bas** équivalents, pour rester utilisable au clavier — le
  glisser-déposer natif n'étant pas accessible sans eux.

Chaque liste est un `useFieldArray` de React Hook Form (`keyName: "key"` pour ne pas
laisser RHF réécrire le champ `id` propre à chaque référence/point, un piège classique
quand l'objet manipulé a déjà sa propre clé `id`).

## Validation

Comme pour les modules précédents, la validation est scindée en deux niveaux :

- **`validation/report.schema.ts` (Zod, forme)** — s'applique en continu, y compris sur
  un brouillon : chaque référence biblique déjà saisie ne peut pas être vide, chaque
  point de prière déjà créé doit avoir un titre, les horaires doivent être cohérents
  (`endTime > startTime`). Un brouillon peut néanmoins être enregistré sans aucun point
  de prière ni aucune référence — ces règles ne s'appliquent qu'aux éléments présents.
- **`ReportValidationService.checkCompleteness` (métier, soumission)** — plus strict,
  vérifié en direct dans le formulaire pour activer/désactiver le bouton « Soumettre » :
  date, heures et nombre de personnes connectées renseignés, et **au moins un point de
  prière**.

## Vue détail — reconstitution fidèle

`ReportSummary` ne liste pas des champs : elle reconstitue le compte rendu tel qu'il
sera lu, dans l'ordre fixe des sections, avec les points de prière numérotés et leurs
références imbriquées. Elle est pensée pour être imprimée telle quelle
(`print:break-inside-avoid` sur chaque section, `ReportExportService.print`).

## Flux de données

```
ReportsView (page liste)                  ReportDetailView / ReportEditView (pages dédiées)
   │                                          │
   ├─ useReports()      ──► ReportService.list(context) ──► Repository (mock | Supabase)
   ├─ useReportStats()  ──► computeReportStats()   (pur, dérivé du cache)
   ├─ useReportsFilters()──► applyReportFilters()  (pur, en mémoire)
   │                                          ├─ ReportForm ──► ReportFormFields (6 sections)
   ├─ ReportStatistics, ReportEvolutionChart      ├─ useReportAutosave() (debounce 2 s, silencieux)
   ├─ ReportFilters, ReportTable                  ├─ ReportValidationService.checkCompleteness()
   └─ use-report-mutations (submit/validate/…)    └─ ReportSummary (reconstitution fidèle)
          └─ ReportService ──► Repository ──► invalidation React Query
```

Aucun composant n'appelle Supabase (ni même `ReportRepository`) directement : tout
passe par `ReportService`, qui choisit l'implémentation au moment de l'appel :

```ts
function getRepository(): ReportRepository {
  return isSupabaseConfigured() ? SupabaseReportRepository : MockReportRepository;
}
```

## Isolation stricte par rôle

Contrairement aux autres modules (où l'isolation est surtout une question d'affichage),
un conducteur ne doit **jamais** accéder aux comptes rendus d'un autre auteur — y
compris via une URL directe. Cette règle est appliquée à la couche données, pas
seulement dans l'UI :

- `MockReportRepository.list`/`getById` filtrent par `ReportListContext { userId, role }`
  (`role === "ADMIN" || report.authorId === context.userId`) ;
- côté Supabase, les policies RLS de `reports` (`reports_select`) appliquent exactement
  la même règle (`auth.uid() = created_by or is_admin()`) — aucune logique dupliquée à
  maintenir côté client, la même contrainte existe des deux côtés.

## Permissions

`getReportPermissions(role)` centralise les droits ; le statut du CR
(`ReportWorkflowService`, pur — `isEditable`/`isSubmittable`/`isValidatable`/
`isRejectable`) et la propriété (`report.authorId === currentUserId`) sont combinés au
niveau des composants, jamais dans les services eux-mêmes :

| Droit | `ADMIN` | `PRAYER_LEADER` |
| --- | --- | --- |
| Voir tous les CR | ✅ | ❌ (les siens uniquement) |
| Créer un brouillon | ✅ (si conducteur assigné à un créneau) | ✅ |
| Modifier / soumettre | ❌ | ✅, si auteur et statut `DRAFT`/`REJECTED` |
| Valider / rejeter / commenter | ✅ | ❌ |
| Supprimer / exporter | ✅ | ❌ |

Un `ADMIN` peut lui-même être assigné comme conducteur sur un créneau (le rôle n'exclut
pas d'apparaître dans le Planning) : `canCreate` était figé à `false` pour ce rôle, ce qui
bloquait totalement la rédaction de son propre CR — sans qu'aucune autre porte de sortie
n'existe. La policy RLS `reports_insert_own` (`prayer_leader_id = auth.uid()`) autorisait
déjà ce cas côté base ; seul le front-end bloquait en trop. Corrigé en alignant
`canCreate` sur cette même règle des deux côtés.

### Bug corrigé : créneaux disponibles jamais chargés

`queryAvailablePlanningSlots` (`report.queries.ts`) filtrait avec
`.not("id", "in", "(select planning_id from reports)")` — PostgREST n'accepte **pas**
de sous-requête SQL comme valeur de `.not(...)`, seulement une liste littérale. Cette
requête échouait systématiquement (jamais fonctionnelle en production Supabase), ce qui
vidait silencieusement le sélecteur de créneau de `/comptes-rendus/nouveau` : le
tableau de bord comptait des CR en attente, mais impossible d'en créer un seul. Corrigé
en récupérant les `planning_id` déjà documentés séparément, puis en les excluant
explicitement — la requête est désormais aussi scoped au conducteur courant
(`prayer_leader_id = userId`), pour matcher exactement ce que la RLS autorise réellement
à l'insertion (`MockReportRepository` reste volontairement non filtré par conducteur en
mode démo — voir le commentaire dans `mock-report-repository.ts`).

## Workflow

```
DRAFT ──submit──► SUBMITTED ──validate──► VALIDATED
  ▲                   │
  └──────reject───────┘ (REJECTED, éditable et resoumissible)
```

`ReportWorkflowService` ne connaît que le statut — jamais le rôle ni la propriété,
combinés séparément par les composants (`ReportDetailView`, `ReportEditView`,
colonnes de `ReportTable`).

## Mode démo

Tant qu'aucun projet Supabase n'est configuré, `MockReportRepository` tient un tableau
mutable en mémoire (`INITIAL_MOCK_REPORTS`, 8 CR fictifs couvrant les 4 statuts, avec
plusieurs points de prière et références par CR) : créer, modifier, soumettre, valider,
rejeter, commenter et supprimer un CR fonctionnent réellement, sans écrire dans une
base. Plusieurs CR sont attribués à `mock-user` (voir `shared/constants/mock-profile.ts`)
pour que le mode démo reste utilisable en testant le rôle `PRAYER_LEADER`.

## Stockage Supabase des listes imbriquées

Les listes de références bibliques et les points de prière sont des structures
imbriquées de taille variable (un point peut avoir un nombre illimité de versets).
Elles sont stockées en colonnes `jsonb` (`thanksgiving`, `holy_spirit_invitation`,
`prayer_points`, `closing_thanksgiving`) plutôt que normalisées en tables filles : ce
contenu n'est jamais interrogé colonne par colonne, toujours lu et écrit comme un bloc
par section, et la normalisation relationnelle n'apporterait ici qu'une complexité
supplémentaire (jointures, tri applicatif de l'ordre) sans bénéfice réel. Voir
[`DATABASE.md`](./DATABASE.md#reports) pour le détail de la migration.

## Composants

| Composant | Rôle |
| --- | --- |
| `ReportHeader` | En-tête de la page liste, lien « Nouveau compte rendu » (gated) |
| `ReportStatistics`, `ReportEvolutionChart` | Indicateurs et évolution (Recharts, lazy) |
| `ReportFilters` | Recherche + filtres combinables (statut, conducteur, auteur, période) |
| `ReportTable` | TanStack Table — tri, pagination, colonnes masquables, sélection multiple |
| `ReportCard` | Résumé compact d'un CR (créneau, statut, conducteur/auteur) |
| `ReportForm` / `ReportFormFields` | Formulaire complet, 6 sections en Cards Shadcn |
| `ReportGeneralInfoFields` | Section Informations générales |
| `BibleReferenceListField` | Liste réordonnable de références, réutilisée 4×  |
| `ReportPrayerPointsField` | Points de prière réordonnables, avec leurs références imbriquées |
| `ReportSummary` | Reconstitution fidèle du déroulé, vue détail et impression |
| `ReportStatusBadge`, `ReportTimeline`, `ReportComments`, `ReportEmptyState`, `ReportExportMenu` | Briques de présentation réutilisables |

## Services

| Service | Rôle |
| --- | --- |
| `ReportRepository` (interface) | Contrat CRUD + workflow + créneaux disponibles + commentaires |
| `MockReportRepository` / `SupabaseReportRepository` | Implémentations, choisies par `ReportService` |
| `ReportService` | API publique consommée par les hooks (seul point d'entrée) |
| `ReportWorkflowService` | Machine à états pure (statut → actions permises) |
| `ReportValidationService` | Complétude requise pour la soumission, pure et testable |
| `ReportExportService` | Impression fonctionnelle ; PDF/Word en architecture (voir ci-dessous) |

## Export — architecture prête, PDF/Word à venir

`ReportExportMenu` propose Impression (fonctionnelle, `window.print()`), Export PDF et
Export Word (facades qui renvoient un message « à venir »). Impression choisie comme
seule fonctionnalité activée immédiatement : elle ne nécessite aucune dépendance
supplémentaire et `ReportSummary` est déjà pensée pour un rendu imprimable
(`print:break-inside-avoid`). Pour activer PDF/Word :

1. Introduire une bibliothèque de génération (ex. `@react-pdf/renderer` pour le PDF,
   `docx` pour Word).
2. Construire le gabarit à partir de la même reconstitution que `ReportSummary` (les
   deux doivent rester visuellement cohérents).
3. Remplacer le corps de `ReportExportService.exportToPdf`/`exportToWord` — aucun autre
   fichier du module n'a besoin de changer, `ReportExportMenu` appelle déjà le service.

## Notifications — événements préparés

Le futur module Notifications consommera les transitions de statut déjà exposées par
`ReportService`/`use-report-mutations.ts` (CR créé, soumis, validé, rejeté) — aucun
événement dédié n'est encore émis, mais chaque mutation correspond exactement à un
événement futur, sans changement de forme nécessaire côté Comptes rendus.

## Prochaine étape : connexion Supabase réelle

1. Lier le projet (`supabase link`) et appliquer les migrations (voir `SUPABASE_SETUP.md`).
2. Régénérer `src/shared/types/database.ts` (`supabase gen types typescript`).
3. Aucun changement dans `features/reports/components/` ni `hooks/` : `ReportService`
   bascule automatiquement sur `SupabaseReportRepository` dès que
   `isSupabaseConfigured()` répond `true`.
4. Vérifier les policies RLS de `reports` et `report_comments` (déjà posées, restreignant
   la lecture/écriture à l'auteur ou à un admin — cohérent avec l'isolation stricte
   décrite plus haut).
