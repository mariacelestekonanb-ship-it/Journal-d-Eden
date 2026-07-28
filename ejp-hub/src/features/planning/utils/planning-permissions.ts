import type { Role } from "@/shared/constants/roles";

export interface PlanningPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDuplicate: boolean;
  canCancel: boolean;
  /** Glisser-déposer / redimensionner un événement dans le calendrier. */
  canDragAndDrop: boolean;
}

const READ_ONLY: PlanningPermissions = {
  canView: true,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canDuplicate: false,
  canCancel: false,
  canDragAndDrop: false,
};

const FULL_ACCESS: PlanningPermissions = {
  canView: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canDuplicate: true,
  canCancel: true,
  canDragAndDrop: true,
};

/**
 * ADMIN a le CRUD complet, PRAYER_LEADER est en lecture seule. Pour ajouter
 * un rôle ou affiner une permission plus tard (ex. un conducteur pourrait
 * un jour modifier ses propres créneaux), il suffit d'étendre cette seule
 * fonction — aucun composant ne teste `role === "ADMIN"` directement.
 */
export function getPlanningPermissions(role: Role | null): PlanningPermissions {
  if (role === "ADMIN") return FULL_ACCESS;
  return READ_ONLY;
}
