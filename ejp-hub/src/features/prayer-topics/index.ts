/**
 * Point d'entrée public du module Sujets de prière. Les autres modules (et
 * les routes de `src/app/`) ne doivent importer que depuis ce fichier —
 * jamais un chemin profond vers `services/`, `queries/`, `data/`, etc.
 */
export { PrayerTopicsView } from "./pages/prayer-topics-view";
export { PrayerTopicsArchiveView } from "./pages/prayer-topics-archive-view";
export type {
  PrayerTopic,
  PrayerTopicAuthorOption,
  PrayerTopicCategory,
  PrayerTopicFilters,
  PrayerTopicPriority,
  PrayerTopicStatus,
  PrayerTopicViewMode,
} from "./types/prayer-topic.types";
export { PrayerTopicService } from "./services/prayer-topic.service";
export { getPrayerTopicPermissions, type PrayerTopicPermissions } from "./utils/prayer-topic-permissions";
