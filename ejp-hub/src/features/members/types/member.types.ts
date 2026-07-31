import type { Role } from "@/shared/constants/roles";
import type { MemberStatus as DbMemberStatus, PlanningStatus, ReportStatus } from "@/shared/types/database";

export type MemberStatus = DbMemberStatus;

/**
 * Alias volontaire vers `Role` (`shared/constants/roles.ts`) plutôt qu'un
 * enum dupliqué : les rôles applicatifs sont un concept transverse, pas
 * spécifique aux Membres. `Role`/`ROLES` sont déjà pensés pour accueillir un
 * futur rôle sans toucher aux guards, au middleware ni à ce module — voir
 * `AUTHENTICATION.md#ajouter-un-rôle-plus-tard`.
 */
export type MemberRole = Role;

/** Administrateur ayant traité une demande d'adhésion. */
export interface MemberValidator {
  id: string;
  fullName: string;
}

/**
 * Un membre — le profil applicatif d'un conducteur de prière ou d'un
 * administrateur. Correspond 1:1 à une ligne `profiles` ; `registeredAt` et
 * `createdAt` partagent la même valeur (`created_at`) mais sont exposés
 * séparément pour refléter leur sens métier distinct (date d'inscription vs
 * audit technique), demandé explicitement par le brief.
 */
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  role: MemberRole;
  status: MemberStatus;
  registeredAt: string;
  validatedAt: string | null;
  validatedBy: MemberValidator | null;
  /** Suppression douce par un admin — profil et historique conservés, connexion bloquée. Voir MEMBERS.md#suppression. */
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Entrée de l'historique des affectations Planning d'un membre (fiche membre). */
export interface MemberAssignmentSummary {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: PlanningStatus;
}

/** Entrée de l'historique des comptes rendus rédigés par un membre (fiche membre). */
export interface MemberReportSummary {
  id: string;
  planningSlotTitle: string;
  date: string;
  status: ReportStatus;
}

export interface MemberFilters {
  search: string;
  status: MemberStatus | null;
  role: MemberRole | null;
}

export const EMPTY_MEMBER_FILTERS: MemberFilters = {
  search: "",
  status: null,
  role: null,
};

export interface MemberStatsSummary {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  suspendedCount: number;
}

/** Callbacks d'action partagés entre `MemberTable` et les pages qui l'utilisent. */
export interface MemberCallbacks {
  onView: (member: Member) => void;
  onAccept: (member: Member) => void;
  onRefuse: (member: Member) => void;
  onSuspend: (member: Member) => void;
  onReactivate: (member: Member) => void;
  onDelete: (member: Member) => void;
  onRestore: (member: Member) => void;
}
