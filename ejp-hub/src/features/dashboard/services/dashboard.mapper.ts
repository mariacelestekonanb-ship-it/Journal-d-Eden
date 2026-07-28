import { FileText, HeartHandshake, Sparkles } from "lucide-react";

import { getFullName } from "@/shared/utils/get-full-name";

import type {
  ActivityLogEntry,
  DashboardNotification,
  RecentPrayerTopicSummary,
  UpcomingSlotSummary,
} from "../types/dashboard.types";
import type {
  RawActivityRow,
  RawNotificationRow,
  RawPrayerTopicRow,
  RawUpcomingSlotRow,
} from "./dashboard.queries";

const UNKNOWN_NAME = "Utilisateur inconnu";

/**
 * Convertit les lignes brutes renvoyées par Supabase (`dashboard.queries.ts`)
 * en types applicatifs (`dashboard.types.ts`). Isole le reste du module de
 * la forme exacte des tables — un renommage de colonne ne touche que ce
 * fichier.
 */
export const DashboardMapper = {
  toUpcomingSlotSummary(row: RawUpcomingSlotRow): UpcomingSlotSummary {
    return {
      id: row.id,
      date: row.slot_date,
      startTime: row.start_time,
      endTime: row.end_time,
      location: row.location,
      topicTitle: row.prayer_topic?.title ?? null,
      leaderName: row.prayer_leader ? getFullName(row.prayer_leader) : null,
    };
  },

  toRecentPrayerTopicSummary(row: RawPrayerTopicRow): RecentPrayerTopicSummary {
    return {
      id: row.id,
      title: row.title,
      priority: row.priority,
      date: row.created_at.slice(0, 10),
      authorName: row.author ? getFullName(row.author) : UNKNOWN_NAME,
    };
  },

  toDashboardNotification(row: RawNotificationRow): DashboardNotification {
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      createdAt: row.created_at,
      readAt: row.read_at,
    };
  },

  reportRowToActivity(row: RawActivityRow): ActivityLogEntry {
    return {
      id: `report-${row.id}`,
      actorName: row.actor ? getFullName(row.actor) : UNKNOWN_NAME,
      action: "a rempli un compte rendu",
      timestamp: row.timestamp,
      icon: FileText,
    };
  },

  testimonyRowToActivity(row: RawActivityRow): ActivityLogEntry {
    return {
      id: `testimony-${row.id}`,
      actorName: row.actor ? getFullName(row.actor) : UNKNOWN_NAME,
      action: "a ajouté un témoignage",
      timestamp: row.timestamp,
      icon: Sparkles,
    };
  },

  topicRowToActivity(row: RawActivityRow): ActivityLogEntry {
    return {
      id: `topic-${row.id}`,
      actorName: row.actor ? getFullName(row.actor) : UNKNOWN_NAME,
      action: "a créé un sujet de prière",
      timestamp: row.timestamp,
      icon: HeartHandshake,
    };
  },
};
