import type { PlanningStatus } from "@/shared/types/database";

export type { PlanningStatus };

/** Un conducteur (principal ou secondaire) tel qu'affiché sur un créneau. */
export interface PlanningParticipant {
  id: string;
  fullName: string;
}

/** Référence légère vers un sujet de prière, sans dupliquer tout le module Sujets de prière. */
export interface PlanningPrayerTopicRef {
  id: string;
  title: string;
}

/**
 * Un créneau de prière — le modèle métier central du module Planning, dont
 * dépendent les comptes rendus, notifications et statistiques du tableau
 * de bord.
 */
export interface PrayerSlot {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  primaryLeader: PlanningParticipant | null;
  secondaryLeader: PlanningParticipant | null;
  status: PlanningStatus;
  theme: string | null;
  prayerTopic: PlanningPrayerTopicRef | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Entrée du sélecteur de conducteur (principal/secondaire) dans le formulaire. */
export interface PlanningLeaderOption {
  id: string;
  fullName: string;
}

export type PlanningConflictType = "DOUBLE_BOOKING" | "LEADER_CONFLICT" | "INVALID_TIME_RANGE";

/** Un conflit détecté par `PlanningConflictService`, affiché dans le formulaire. */
export interface PlanningConflict {
  type: PlanningConflictType;
  message: string;
  /** Créneaux existants impliqués dans le conflit (vide pour un horaire invalide). */
  conflictingSlotIds: string[];
}

/** Filtres combinables de la liste des créneaux — voir `use-planning-filters`. */
export interface PlanningFilters {
  search: string;
  dateFrom: string | null;
  dateTo: string | null;
  leaderId: string | null;
  location: string | null;
  status: PlanningStatus | null;
  prayerTopicId: string | null;
}

export const EMPTY_PLANNING_FILTERS: PlanningFilters = {
  search: "",
  dateFrom: null,
  dateTo: null,
  leaderId: null,
  location: null,
  status: null,
  prayerTopicId: null,
};

/** Les 4 vues du module — voir PlanningToolbar et use-planning-view. */
export type PlanningViewMode = "overview" | "week" | "month" | "list";
