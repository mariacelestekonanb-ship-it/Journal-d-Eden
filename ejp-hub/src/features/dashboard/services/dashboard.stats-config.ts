import { CalendarClock, CalendarDays, FileText, HeartHandshake, Sparkles, UserPlus, Users, type LucideIcon } from "lucide-react";

export interface StatConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Libellés et icônes des cartes de statistiques, séparés de leur valeur.
 * Source unique consommée à la fois par les données fictives
 * (`data/dashboard.mocks.ts`) et par les vraies requêtes
 * (`dashboard.service.ts`), pour ne jamais dupliquer un libellé.
 */
export const ADMIN_STATS_CONFIG: StatConfig[] = [
  { id: "prayer-leaders-count", label: "Conducteurs de prière", icon: Users },
  { id: "active-topics-count", label: "Sujets de prière actifs", icon: HeartHandshake },
  { id: "pending-reports-count", label: "Comptes rendus en attente", icon: FileText },
  { id: "published-testimonies-count", label: "Témoignages publiés", icon: Sparkles },
  { id: "pending-members-count", label: "Demandes d'adhésion en attente", icon: UserPlus },
];

export const PRAYER_LEADER_STATS_CONFIG: StatConfig[] = [
  { id: "my-slots-this-week-count", label: "Mes conduites cette semaine", icon: CalendarDays },
  { id: "my-pending-reports-count", label: "Mes comptes rendus à compléter", icon: FileText },
  { id: "my-unread-notifications-count", label: "Mes notifications non lues", icon: Sparkles },
  { id: "my-upcoming-slots-count", label: "Mes prochains créneaux", icon: CalendarClock },
];
