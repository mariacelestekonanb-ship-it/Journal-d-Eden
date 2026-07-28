# planning

Le moteur de planification d'EJP Hub — dont dépendront les comptes rendus,
notifications et statistiques du tableau de bord.

```
types/        # PrayerSlot, PlanningStatus, filtres, conflits — le modèle métier
validation/   # Schéma Zod du formulaire
data/         # Fixtures de démonstration (mode démo)
mappers/      # Lignes Supabase → PrayerSlot
queries/      # Requêtes Supabase brutes (préparées, pas encore appelées en prod)
services/     # PlanningRepository (interface + impl. mock/Supabase), PlanningService,
              # PlanningConflictService, PlanningExportService
actions/      # Façades d'écriture appelées par les hooks (create/update/delete/duplicate/cancel)
hooks/        # React Query + état local (filtres, vue persistée, conflits en direct)
utils/        # Statuts, permissions par rôle, mapping formulaire ↔ créneau
components/   # Composants réutilisables (voir PLANNING.md)
pages/        # PlanningView — assemble toute la page
```

Voir [`PLANNING.md`](../../../../PLANNING.md) à la racine du projet pour
l'architecture complète, le flux de données et les décisions de conception.

## Règle d'architecture

Les composants et hooks ne connaissent que `PlanningService` — jamais
Supabase, jamais `planning.queries.ts` ni `PlanningRepository` directement.

## Import

```ts
import { PlanningView } from "@/features/planning";
```
