import type { Role } from "@/shared/constants/roles";

export interface ReportPermissions {
  /** Voit tous les CR (admin) plutôt que seulement les siens (conducteur — appliqué dès le dépôt de données, pas seulement l'UI). */
  canViewAll: boolean;
  canCreate: boolean;
  canValidate: boolean;
  canReject: boolean;
  canDelete: boolean;
  canExport: boolean;
  canComment: boolean;
}

const ADMIN: ReportPermissions = {
  canViewAll: true,
  // Un admin peut lui-même être conducteur assigné à un créneau (le rôle
  // n'empêche pas d'apparaître dans le Planning) : la RLS `reports_insert_own`
  // n'autorise de toute façon la création que pour son propre créneau
  // (`prayer_leader_id = auth.uid()`), donc bloquer ici n'ajoutait qu'une
  // impasse — un admin-conducteur ne pouvait jamais rédiger son propre CR.
  canCreate: true,
  canValidate: true,
  canReject: true,
  canDelete: true,
  canExport: true,
  canComment: true,
};

const PRAYER_LEADER: ReportPermissions = {
  canViewAll: false,
  canCreate: true,
  canValidate: false,
  canReject: false,
  canDelete: false,
  canExport: false,
  canComment: false,
};

/**
 * ADMIN valide/rejette/supprime/exporte et voit tout ; PRAYER_LEADER crée,
 * modifie et soumet ses propres brouillons uniquement (l'isolation est
 * appliquée dès `ReportRepository.list`, pas seulement ici). Modifier et
 * soumettre dépendent aussi du statut du CR (voir `ReportWorkflowService`)
 * et de la propriété (`report.authorId === currentUserId`), combinés au
 * niveau des composants — aucun ne teste `role === "ADMIN"` directement.
 */
export function getReportPermissions(role: Role | null): ReportPermissions {
  return role === "ADMIN" ? ADMIN : PRAYER_LEADER;
}
