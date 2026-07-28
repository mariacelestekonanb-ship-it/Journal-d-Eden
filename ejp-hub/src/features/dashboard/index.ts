/**
 * Point d'entrée public du module Dashboard. Les autres modules (et les
 * routes de `src/app/`) ne doivent importer que depuis ce fichier — jamais
 * un chemin profond vers `services/`, `data/` ou `hooks/`.
 */
export { DashboardView } from "./pages/dashboard-view";
export type {
  ActivityLogEntry,
  DashboardNotification,
  DashboardStat,
  QuickAction,
  RecentPrayerTopicSummary,
  UpcomingSlotSummary,
} from "./types/dashboard.types";
