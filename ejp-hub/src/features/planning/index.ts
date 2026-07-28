/**
 * Point d'entrée public du module Planning. Les autres modules (et les
 * routes de `src/app/`) ne doivent importer que depuis ce fichier — jamais
 * un chemin profond vers `services/`, `queries/`, `data/`, etc.
 */
export { PlanningView } from "./pages/planning-view";
export type {
  PlanningConflict,
  PlanningFilters,
  PlanningParticipant,
  PlanningPrayerTopicRef,
  PlanningStatus,
  PlanningViewMode,
  PrayerSlot,
} from "./types/planning.types";
export { PlanningService } from "./services/planning.service";
export { getPlanningPermissions, type PlanningPermissions } from "./utils/planning-permissions";
