# reports

Le module Comptes rendus — reproduit le déroulé réel d'une chaîne de prière de l'EJP
(informations générales, actions de grâce, invitation du Saint-Esprit, points de
prière, fin/actions de grâce, annonces) : rédaction, workflow de validation, historique
et archivage.

```
types/         # Report, ReportComment, statuts, filtres — le modèle métier
validation/    # Schéma Zod du formulaire (souple — un brouillon incomplet reste enregistrable)
data/          # Fixtures de démonstration (mode démo)
mappers/       # Lignes Supabase → Report
queries/       # Requêtes Supabase brutes (préparées, pas encore appelées en prod)
repositories/  # ReportRepository (interface + impl. mock/Supabase)
services/      # ReportService, ReportValidationService, ReportWorkflowService, ReportExportService
actions/       # Façades d'écriture appelées par les hooks (create/update/submit/validate/reject/delete/comment)
hooks/         # React Query + état local (filtres, statistiques, autosave)
utils/         # Statuts, permissions par rôle, timeline, options de filtre
components/    # Composants réutilisables (voir REPORTS.md)
pages/         # ReportsView (liste), ReportCreateView, ReportDetailView, ReportEditView
```

Voir [`REPORTS.md`](../../../../REPORTS.md) à la racine du projet pour l'architecture
complète, le workflow et les décisions de conception.

## Règle d'architecture

Les composants et hooks ne connaissent que `ReportService` — jamais Supabase, jamais
`report.queries.ts` ni `ReportRepository` directement.

## Import

```ts
import { ReportsView, ReportCreateView, ReportDetailView, ReportEditView } from "@/features/reports";
```
