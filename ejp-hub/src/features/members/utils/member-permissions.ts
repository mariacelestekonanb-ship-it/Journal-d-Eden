import type { Role } from "@/shared/constants/roles";

export interface MemberPermissions {
  /** Voit tous les membres (admin) plutôt que seulement son propre profil. */
  canViewAll: boolean;
  canValidate: boolean;
  canRefuse: boolean;
  canSuspend: boolean;
  canReactivate: boolean;
  canChangeRole: boolean;
  /** Changer l'e-mail d'un autre membre — jamais le sien via cette voie (voir `member-email.schema.ts`). */
  canChangeEmail: boolean;
}

const ADMIN: MemberPermissions = {
  canViewAll: true,
  canValidate: true,
  canRefuse: true,
  canSuspend: true,
  canReactivate: true,
  canChangeRole: true,
  canChangeEmail: true,
};

const PRAYER_LEADER: MemberPermissions = {
  canViewAll: false,
  canValidate: false,
  canRefuse: false,
  canSuspend: false,
  canReactivate: false,
  canChangeRole: false,
  canChangeEmail: false,
};

/**
 * ADMIN voit tous les membres, valide/refuse les demandes, suspend/réactive
 * et change les rôles ; PRAYER_LEADER ne consulte et ne modifie que son
 * propre profil (l'isolation est appliquée dès `MemberRepository.list`, pas
 * seulement ici).
 */
export function getMemberPermissions(role: Role | null): MemberPermissions {
  return role === "ADMIN" ? ADMIN : PRAYER_LEADER;
}
