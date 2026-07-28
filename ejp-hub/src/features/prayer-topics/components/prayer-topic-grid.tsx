import type { PrayerTopic, PrayerTopicCallbacks } from "../types/prayer-topic.types";
import type { PrayerTopicPermissions } from "../utils/prayer-topic-permissions";
import { PrayerTopicCard } from "./prayer-topic-card";
import { PrayerTopicEmptyState } from "./prayer-topic-empty-state";

export interface PrayerTopicGridProps {
  topics: PrayerTopic[];
  permissions: PrayerTopicPermissions;
  callbacks: PrayerTopicCallbacks;
}

/** Vue Cartes des sujets de prière — grille responsive (1 colonne mobile, jusqu'à 3 en desktop). */
export function PrayerTopicGrid({ topics, permissions, callbacks }: PrayerTopicGridProps) {
  if (topics.length === 0) {
    return <PrayerTopicEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {topics.map((topic) => (
        <PrayerTopicCard key={topic.id} topic={topic} permissions={permissions} callbacks={callbacks} />
      ))}
    </div>
  );
}
