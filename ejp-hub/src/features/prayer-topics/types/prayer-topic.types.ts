import type { LucideIcon } from "lucide-react";

import type { TopicCategory, TopicPriority, TopicStatus } from "@/shared/types/database";

export type PrayerTopicPriority = TopicPriority;
export type PrayerTopicStatus = TopicStatus;
export type PrayerTopicCategory = TopicCategory;

export interface PrayerTopic {
  id: string;
  title: string;
  description: string | null;
  category: PrayerTopicCategory;
  priority: PrayerTopicPriority;
  status: PrayerTopicStatus;
  startDate: string;
  endDate: string | null;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface PrayerTopicAuthorOption {
  id: string;
  fullName: string;
}

export type PrayerTopicViewMode = "list" | "cards";

export interface PrayerTopicFilters {
  search: string;
  category: PrayerTopicCategory | null;
  priority: PrayerTopicPriority | null;
  status: PrayerTopicStatus | null;
  authorId: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

export const EMPTY_PRAYER_TOPIC_FILTERS: PrayerTopicFilters = {
  search: "",
  category: null,
  priority: null,
  status: null,
  authorId: null,
  dateFrom: null,
  dateTo: null,
};

export interface PrayerTopicStatsSummary {
  activeCount: number;
  archivedCount: number;
  urgentCount: number;
  draftCount: number;
  /** Nombre de sujets créés par mois, les 6 derniers mois — alimente le graphique d'évolution. */
  evolution: { label: string; count: number }[];
}

export interface PrayerTopicTimelineEntry {
  id: string;
  label: string;
  description?: string;
  timestamp: string;
  icon: LucideIcon;
}

/** Callbacks d'action partagés entre `PrayerTopicCard` et les colonnes de `PrayerTopicTable`. */
export interface PrayerTopicCallbacks {
  onView: (topic: PrayerTopic) => void;
  onEdit: (topic: PrayerTopic) => void;
  onDuplicate: (topic: PrayerTopic) => void;
  onArchive: (topic: PrayerTopic) => void;
  onRestore: (topic: PrayerTopic) => void;
  onDelete: (topic: PrayerTopic) => void;
}
