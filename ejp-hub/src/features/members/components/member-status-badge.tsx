import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";

import type { MemberStatus } from "../types/member.types";
import { MEMBER_STATUS_BADGE_VARIANT, MEMBER_STATUS_LABELS } from "../utils/member-status";

export interface MemberStatusBadgeProps {
  status: MemberStatus;
  /** Prioritaire sur `status` — un compte supprimé reste affiché comme tel quel que soit son statut sous-jacent. */
  deletedAt?: string | null;
  className?: string;
}

function MemberStatusBadgeComponent({ status, deletedAt, className }: MemberStatusBadgeProps) {
  if (deletedAt) {
    return (
      <AppBadge variant="outline" className={className}>
        Supprimé
      </AppBadge>
    );
  }

  return (
    <AppBadge variant={MEMBER_STATUS_BADGE_VARIANT[status]} className={className}>
      {MEMBER_STATUS_LABELS[status]}
    </AppBadge>
  );
}

/** Badge de statut réutilisable (table, fiche membre, demandes). */
export const MemberStatusBadge = React.memo(MemberStatusBadgeComponent);
