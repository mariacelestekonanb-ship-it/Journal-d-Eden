# Administration

Le module Administration est le centre de gestion de la plateforme EJP Hub : tableau de
bord agrégé, gestion des rôles, paramètres généraux, catégories configurables, journal
d'administration et recherche globale — tous réservés aux `ADMIN`. Ce document explique
l'architecture, les décisions de conception et les limites assumées de ce sprint — le
[`README.md`](./src/features/admin/README.md) du module renvoie ici pour le détail.

## Restructuration de `/administration`

Avant ce sprint, `/administration` était la page Membres (liste, demandes, fiche). Le
brief de ce module demande explicitement un tableau de bord d'administration à cette même
racine — un conflit de propriété de route qu'il fallait résoudre pour intégrer
correctement le nouveau module, comme le permettait la consigne du sprint :

| Avant | Après |
| --- | --- |
| `/administration` (liste Membres) | `/administration/membres` |
| `/administration/demandes` | `/administration/membres/demandes` |
| `/administration/[id]` | `/administration/membres/[id]` |
| — | `/administration` (nouveau : `AdminDashboard`) |
| — | `/administration/roles` |
| — | `/administration/parametres` |
| — | `/administration/categories` |
| — | `/administration/journal` |

Le module Membres n'a pas changé de logique : seuls ses trois fichiers de route ont
déménagé, et les quatre liens internes qui pointaient vers `/administration` ont été mis à
jour (`MemberHeader`, `MembersView`, `MemberRequestsView`, `MemberDetailView`), ainsi que
trois `actionUrl` de notifications de démonstration. `ROUTE_PERMISSIONS` n'a pas eu besoin
de changer : l'entrée `{ prefix: "/administration", roles: ["ADMIN"] }` déjà en place
couvre par préfixe toutes les nouvelles sous-routes.

## Modèle métier

```ts
interface PlatformSettings {
  platformName: string;
  logoUrl: string | null;
  description: string | null;
  timezone: string;
  language: string;
  updatedAt: string;
  updatedBy: { id: string; fullName: string } | null;
}

interface AdminCategory {
  id: string;
  scope: "PRAYER_TOPIC_CATEGORY" | "MEETING_TYPE";
  label: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface AuditLogEntry {
  id: string;
  actor: { id: string; fullName: string } | null;
  action: string;
  module: string;
  targetLabel: string | null;
  createdAt: string;
}

interface AdminDashboardStats {
  totalMembers: number;
  activeLeaders: number;
  pendingMembershipRequests: number;
  scheduledSlots: number;
  pendingReports: number;
  activePrayerTopics: number;
  unreadNotifications: number;
}
```

Trois tables Supabase dédiées soutiennent ce modèle : `app_settings` (singleton, garanti
par un index unique `((true))`), `admin_categories` et `admin_audit_log` — voir
[`DATABASE.md`](./DATABASE.md) pour le détail des colonnes et des migrations.

## Flux de données — jamais d'accès direct aux tables des autres modules

Contrairement à tous les modules précédents, `AdminService` (tableau de bord, recherche)
ne relit **jamais** directement les tables `members`, `reports`, `planning`,
`prayer_topics` ou `notifications`. Il appelle exclusivement les services publics déjà
exportés par chaque module :

```ts
async getDashboardStats(adminId: string): Promise<AdminDashboardStats> {
  const context = { userId: adminId, role: "ADMIN" as const };
  const [members, slots, reports, topics, notifications] = await Promise.all([
    MemberService.list(context),
    PlanningService.list(),
    ReportService.list(context),
    PrayerTopicService.list(),
    NotificationService.list(context),
  ]);
  // … agrégation en mémoire
}
```

`AdminSearch` (recherche globale) suit exactement le même principe : un seul
`Promise.all` sur les mêmes services, un filtrage en mémoire, une liste de résultats
typée `AdminSearchResult[]`. Ajouter un module cherchable ou un nouvel indicateur se
résume à un appel de service supplémentaire — aucune table à interroger directement,
aucune duplication de logique métier. Seuls les paramètres, catégories et journal (propres
à ce module) passent par `AdminRepository` (mock ou Supabase, choisi par
`isSupabaseConfigured()`, comme partout ailleurs dans l'application).

`AdminRoles` applique le même principe pour l'écriture : le changement de rôle appelle
`MemberService.changeRole(id, role, adminId)`, la même méthode déjà utilisée par la fiche
membre — aucune logique de rôle dupliquée dans `features/admin`.

## Permissions — plus strictes qu'aucun autre module

Chaque niveau applique la même règle sans exception :

- **Middleware** : `ROUTE_PERMISSIONS` restreint tout `/administration/*` aux `ADMIN`.
- **RLS Supabase** : `app_settings`, `admin_categories` et `admin_audit_log` n'ont chacune
  qu'une politique `for all using (public.is_admin()) with check (public.is_admin())`
  (le journal sépare lecture/écriture mais garde la même contrainte) — **aucune**
  opération, y compris la simple lecture, n'est ouverte à un `PRAYER_LEADER`. C'est plus
  strict que Comptes rendus/Membres (où `ADMIN` voit tout mais where `PRAYER_LEADER`
  garde un accès à ses propres données) et que Notifications (isolation par utilisateur,
  pas par rôle) : ici, un non-administrateur n'a droit à rien du tout.
- **Composants** : `getAdminPermissions(role)` (`utils/admin-permissions.ts`) couvre le
  dernier niveau, le rendu conditionnel — redondant avec les deux premiers par design,
  au cas où un composant Administration serait un jour rendu ailleurs que sous
  `/administration/*`.

## Catégories configurables — une table indépendante, pas encore branchée

Le brief demande un « CRUD complet » sur les catégories de sujets de prière et les types
de réunion. Or `prayer_topics.category` est un **enum Postgres** (`prayer_topic_category`),
pas une table : un enum ne peut pas être modifié en CRUD depuis l'interface sans migration
manuelle. Ce module crée donc `admin_categories`, une table indépendante, entièrement
éditable, seedée avec les mêmes valeurs que l'enum actuel pour rester visuellement
cohérente en démo. Elle **ne pilote pas encore** le sélecteur réel du formulaire Sujets de
prière — le brancher demanderait de modifier ce module, hors périmètre de ce sprint (« ne
modifie aucun module déjà développé sauf si strictement nécessaire pour intégrer ce
nouveau module »). C'est la première évolution listée ci-dessous.

## Journal d'administration — même limite que `NotificationService.notify`

`AdminAuditService.record(...)` est une API complète et prête à l'emploi :

```ts
await AdminAuditService.record({
  actorId: adminId,
  action: "a accepté une demande d'adhésion",
  module: "Membres",
  targetLabel: member.fullName,
});
```

Mais **aucun appelant n'existe encore ailleurs dans l'application** — exactement la même
situation que `NotificationService.notify` documentée dans NOTIFICATIONS.md. Câbler
`AdminAuditService.record(...)` depuis chaque mutation notable de Membres, Comptes rendus
et Sujets de prière demanderait de modifier ces modules, ce que la consigne du sprint
interdit sauf nécessité stricte. Le journal affiché aujourd'hui (`/administration/journal`)
présente des données de démonstration réalistes en mode mock ; en Supabase réel, la table
`admin_audit_log` existe et se remplira dès que ces appels seront ajoutés lors d'un futur
sprint touchant ces modules.

## Sauvegarde — architecture préparée, non implémentée

Conformément au brief (« créer les services sans implémenter encore la logique complète »),
`AdminBackupService` expose trois méthodes stables — `exportSnapshot`,
`scheduleRecurringBackup`, `restoreFromSnapshot` — qui renvoient toutes
`{ supported: false, message: "…" }`. Aucun composant ne les appelle encore : elles
existent pour qu'un futur sprint n'ait qu'à remplacer leur corps, sans toucher à leur
signature ni à l'endroit où elles vivent.

## Composants

| Composant | Rôle |
| --- | --- |
| `AdminDashboard` | Assemble `AdminStats`, `AdminSearch` et les raccourcis vers les 4 sections de gestion |
| `AdminStats` | Les 7 indicateurs du tableau de bord |
| `AdminSearch` | Recherche globale (membres, comptes rendus, sujets de prière, planning) |
| `AdminSettings` | Formulaire des paramètres généraux (RHF + Zod) |
| `AdminRoles` | Table des membres avec sélecteur de rôle par ligne |
| `AdminAuditLog` | Table du journal, avec recherche, filtre par module et par période |
| `AdminCategoryManager` | CRUD complet des catégories, par onglet de liste (`scope`) |
| `AdminEmptyState` | État vide générique du module |
| `AdminCategoryForm`, `AdminQuickLinkCard` | Briques internes de `AdminCategoryManager` et `AdminDashboard` |

## Services

| Service | Rôle |
| --- | --- |
| `AdminRepository` (interface) | Contrat CRUD paramètres/catégories/journal (jamais membres/CR/planning/sujets/notifications) |
| `MockAdminRepository` / `SupabaseAdminRepository` | Implémentations, choisies par `AdminService`/`AdminSettingsService`/`AdminAuditService` |
| `AdminService` | Tableau de bord agrégé, recherche globale, CRUD catégories |
| `AdminSettingsService` | Lecture/écriture des paramètres généraux (singleton) |
| `AdminAuditService` | Lecture du journal, `record(...)` prêt pour les futurs appelants |
| `AdminBackupService` | Stub des trois opérations de sauvegarde (voir ci-dessus) |

## Évolutions futures

1. Brancher `admin_categories` sur le sélecteur réel du formulaire Sujets de prière (et
   migrer l'enum `prayer_topic_category` vers une clé étrangère), une fois ce module
   modifiable dans un sprint dédié.
2. Appeler `AdminAuditService.record(...)` depuis chaque mutation notable de Membres,
   Comptes rendus et Sujets de prière — même chantier que le câblage de
   `NotificationService.notify` déjà documenté dans NOTIFICATIONS.md.
3. Implémenter réellement `AdminBackupService` (export, planification, restauration) une
   fois la stratégie de stockage choisie (Supabase Storage, export SQL planifié…).
4. Recherche globale paginée/côté serveur si le volume de données dépasse ce qu'un
   `Promise.all` en mémoire peut raisonnablement traiter.
5. Réel changement d'e-mail/notification par e-mail lors d'une modification des
   paramètres généraux (aujourd'hui, seule la mise à jour en base est tracée).

## Prochaine étape : connexion Supabase réelle

1. Lier le projet (`supabase link`) et appliquer la migration
   `20260803090001_admin_details.sql` (voir `SUPABASE_SETUP.md`).
2. Régénérer `src/shared/types/database.ts` (`supabase gen types typescript`).
3. Aucun changement dans `features/admin/components/` ni `hooks/` : les trois services
   basculent automatiquement sur `SupabaseAdminRepository` dès que
   `isSupabaseConfigured()` répond `true`.
4. Vérifier les policies RLS des trois tables (déjà posées, strictement `ADMIN`-only sur
   toute opération).
