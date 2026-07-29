# admin

Le module Administration — centre de gestion de la plateforme (tableau de bord, rôles,
paramètres généraux, catégories configurables, journal, recherche globale).

```
types/         # PlatformSettings, AdminCategory, AuditLogEntry, AdminDashboardStats, AdminSearchResult
validation/    # Schémas Zod (paramètres généraux, catégorie configurable)
data/          # Fixtures de démonstration (mode démo)
mappers/       # Lignes Supabase → types du module
queries/       # Requêtes Supabase brutes (paramètres, catégories, journal)
repositories/  # AdminRepository (interface + impl. mock/Supabase)
services/      # AdminService, AdminSettingsService, AdminAuditService, AdminBackupService
actions/       # Façades d'écriture (paramètres, CRUD catégories, journal)
hooks/         # React Query + permissions + filtres (dashboard, recherche, rôles, catégories, journal)
utils/         # Permissions admin-only, libellés de catégorie
components/    # AdminDashboard, AdminStats, AdminSearch, AdminSettings, AdminRoles, AdminAuditLog, AdminCategoryManager, AdminEmptyState
pages/         # Vues câblées sur /administration, /roles, /parametres, /categories, /journal
```

Voir [`ADMIN.md`](../../../../ADMIN.md) à la racine du projet pour l'architecture
complète, le modèle métier et les décisions de conception.

## Règle d'architecture

`AdminService` n'accède **jamais** directement aux tables des autres modules : il appelle
leurs services publics (`MemberService`, `ReportService`, `PlanningService`,
`PrayerTopicService`, `NotificationService`). Seuls les paramètres, catégories et journal
— propres à ce module — passent par `AdminRepository`.

## Import

```ts
import { AdminDashboardView } from "@/features/admin";
```
