import type { AssignmentResponse, PlanningLeaderRole, PlanningStatus, ReplacementRequestStatus } from "@/shared/types/database";

export type { AssignmentResponse, PlanningLeaderRole, PlanningStatus, ReplacementRequestStatus };

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

/** Référence légère vers un programme — utilisée sur un créneau. */
export interface PlanningProgramRef {
  id: string;
  name: string;
}

/** Un conducteur assigné à un programme. */
export interface ProgramMemberRef {
  id: string;
  fullName: string;
}

/**
 * Un programme (ex. « Programme Jeunesse ») : regroupe certains créneaux et
 * une équipe de conducteurs dédiée, assignée explicitement par un
 * administrateur — une personne peut appartenir à plusieurs programmes.
 */
export interface Program {
  id: string;
  name: string;
  description: string | null;
  members: ProgramMemberRef[];
  createdAt: string;
  updatedAt: string;
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
  program: PlanningProgramRef | null;
  notes: string | null;
  prayerLeaderResponse: AssignmentResponse;
  prayerLeaderResponseComment: string | null;
  prayerLeaderResponseAt: string | null;
  secondaryLeaderResponse: AssignmentResponse;
  secondaryLeaderResponseComment: string | null;
  secondaryLeaderResponseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Demande de remplacement : un conducteur assigné (principal ou secondaire)
 * propose un membre précis pour le remplacer sur un créneau — soumise à
 * validation d'un administrateur (voir `ReplacementRequestService`).
 */
export interface ReplacementRequest {
  id: string;
  planningId: string;
  role: PlanningLeaderRole;
  requestedBy: PlanningParticipant;
  proposedMember: PlanningParticipant;
  comment: string | null;
  status: ReplacementRequestStatus;
  createdAt: string;
  decidedAt: string | null;
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
  programId: string | null;
}

export const EMPTY_PLANNING_FILTERS: PlanningFilters = {
  search: "",
  dateFrom: null,
  dateTo: null,
  leaderId: null,
  location: null,
  status: null,
  prayerTopicId: null,
  programId: null,
};

/** Les 5 vues du module — voir PlanningToolbar et use-planning-view. */
export type PlanningViewMode = "overview" | "week" | "month" | "list" | "programs";
