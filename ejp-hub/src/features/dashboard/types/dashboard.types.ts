import type { LucideIcon } from "lucide-react";

import type { NotificationType, TopicPriority } from "@/shared/types/database";

/** Une carte de statistique du tableau de bord (nombre + libellé + icône). */
export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  icon: LucideIcon;
}

/** Résumé d'un créneau de planning à venir, tel qu'affiché dans « Prochaines conduites ». */
export interface UpcomingSlotSummary {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  topicTitle: string | null;
  leaderName: string | null;
}

/** Résumé d'un sujet de prière, tel qu'affiché dans « Derniers sujets de prière ». */
export interface RecentPrayerTopicSummary {
  id: string;
  title: string;
  priority: TopicPriority;
  date: string;
  authorName: string;
}

/** Une notification affichée dans le panneau Notifications. */
export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
}

/** Une entrée de la timeline « Activité récente », réutilisable hors du Dashboard. */
export interface ActivityLogEntry {
  id: string;
  actorName: string;
  action: string;
  timestamp: string;
  icon: LucideIcon;
}

/** Un raccourci de la section « Actions rapides » (aucune action réelle pour l'instant). */
export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
}
