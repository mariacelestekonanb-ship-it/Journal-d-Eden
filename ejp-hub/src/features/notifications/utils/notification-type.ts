import { CalendarDays, FileText, HeartHandshake, Settings2, Users, type LucideIcon } from "lucide-react";

import type { NotificationType } from "../types/notification.types";

/** Source unique des libellés et icônes de type — mêmes icônes que la barre latérale pour rester cohérent visuellement. */
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  PLANNING: "Planning",
  REPORT: "Comptes rendus",
  MEMBER: "Membres",
  PRAYER_TOPIC: "Sujets de prière",
  SYSTEM: "Système",
};

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  PLANNING: CalendarDays,
  REPORT: FileText,
  MEMBER: Users,
  PRAYER_TOPIC: HeartHandshake,
  SYSTEM: Settings2,
};

export const NOTIFICATION_TYPE_OPTIONS: NotificationType[] = ["PLANNING", "REPORT", "MEMBER", "PRAYER_TOPIC", "SYSTEM"];
