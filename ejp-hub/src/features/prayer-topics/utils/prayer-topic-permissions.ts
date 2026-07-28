import type { Role } from "@/shared/constants/roles";

export interface PrayerTopicPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDuplicate: boolean;
  canArchive: boolean;
  canRestore: boolean;
}

const READ_ONLY: PrayerTopicPermissions = {
  canView: true,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canDuplicate: false,
  canArchive: false,
  canRestore: false,
};

const FULL_ACCESS: PrayerTopicPermissions = {
  canView: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canDuplicate: true,
  canArchive: true,
  canRestore: true,
};

/**
 * ADMIN a le CRUD complet, PRAYER_LEADER est en lecture seule. `canCreate`
 * est volontairement isolé du reste de la lecture seule : le brief prévoit
 * qu'un conducteur puisse un jour être autorisé à proposer des sujets —
 * il suffira alors de faire dépendre `canCreate` du rôle indépendamment des
 * autres droits, sans toucher aux composants (aucun ne teste
 * `role === "ADMIN"` directement).
 */
export function getPrayerTopicPermissions(role: Role | null): PrayerTopicPermissions {
  if (role === "ADMIN") return FULL_ACCESS;
  return READ_ONLY;
}
