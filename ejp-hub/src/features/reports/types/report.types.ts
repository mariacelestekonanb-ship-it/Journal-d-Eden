import type { LucideIcon } from "lucide-react";

import type { ReportStatus as DbReportStatus } from "@/shared/types/database";

export type ReportStatus = DbReportStatus;

export interface ReportParticipant {
  id: string;
  fullName: string;
  /** `false` si le membre a été supprimé (ou désactivé) depuis — le nom reste affiché, grisé. Absent = actif. */
  isActive?: boolean;
}

/** Référence légère vers le créneau du Planning associé, sans dupliquer tout ce module. */
export interface ReportPlanningSlotRef {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
}

/** Une référence biblique unique au sein d'une liste (Actions de grâce, Invitation du Saint-Esprit, point de prière…). */
export interface BibleReference {
  id: string;
  reference: string;
}

/** Un point de prière du conducteur — un texte et ses références bibliques associées. */
export interface PrayerPoint {
  id: string;
  title: string;
  references: BibleReference[];
}

/**
 * Informations générales du déroulé — le Planning peut préremplir la date et
 * les horaires, mais le conducteur reste libre de les ajuster (la séance
 * peut avoir débordé, démarré en retard, etc.).
 */
export interface ReportGeneralInfo {
  date: string;
  startTime: string;
  endTime: string;
  connectedCount: number | null;
  hasInstrumental: boolean;
}

/**
 * Un compte rendu — le déroulé réel d'une chaîne de prière de l'EJP, pas un
 * rapport de réunion générique. Chaque créneau du Planning ne peut avoir
 * qu'un seul compte rendu (contrainte `unique` sur `planning_id` côté base).
 *
 * La structure suit l'ordre fixe utilisé par les conducteurs : informations
 * générales, actions de grâce, invitation du Saint-Esprit, points de prière
 * (illimités, chacun avec ses propres références), fin/actions de grâce,
 * puis annonces.
 */
export interface Report {
  id: string;
  planningSlot: ReportPlanningSlotRef;
  /** Le conducteur assigné au créneau (peut différer de l'auteur — voir DATABASE.md). */
  leader: ReportParticipant;
  authorId: string;
  authorName: string;
  generalInfo: ReportGeneralInfo;
  thanksgiving: BibleReference[];
  holySpiritInvitation: BibleReference[];
  prayerPoints: PrayerPoint[];
  closingThanksgiving: BibleReference[];
  announcements: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  validatedAt: string | null;
}

/** Commentaire de suivi (retour admin) sur un compte rendu. */
export interface ReportComment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

/** Un créneau du Planning encore libre (sans compte rendu) — proposé à la création. */
export interface ReportSlotOption {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  leaderId: string;
  leaderName: string;
}

export interface ReportFilters {
  search: string;
  status: ReportStatus | null;
  leaderId: string | null;
  authorId: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

export const EMPTY_REPORT_FILTERS: ReportFilters = {
  search: "",
  status: null,
  leaderId: null,
  authorId: null,
  dateFrom: null,
  dateTo: null,
};

export interface ReportStatsSummary {
  pendingCount: number;
  validatedCount: number;
  rejectedCount: number;
  draftCount: number;
  /** Délai moyen brouillon → validation, en heures — dérivé des CR déjà validés (mock tant que Supabase n'est pas connecté). */
  averageValidationHours: number | null;
  /** Nombre de CR soumis par mois, les 6 derniers mois. */
  evolution: { label: string; count: number }[];
}

export interface ReportTimelineEntry {
  id: string;
  label: string;
  description?: string;
  timestamp: string;
  icon: LucideIcon;
}

/** Callbacks d'action partagés entre `ReportCard` et les colonnes de `ReportTable`. */
export interface ReportCallbacks {
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
  onSubmit: (report: Report) => void;
  onDelete: (report: Report) => void;
}
