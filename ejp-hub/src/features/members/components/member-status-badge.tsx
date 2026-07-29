import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";

import type { MemberStatus } from "../types/member.types";
import { MEMBER_STATUS_BADGE_VARIANT, MEMBER_STATUS_LABELS } from "../utils/member-status";

export interface MemberStatusBadgeProps {
  status: MemberStatus;
  className?: string;
}

function MemberStatusBadgeComponent({ status, className }: MemberStatusBadgeProps) {
  return (
    <AppBadge variant={MEMBER_STATUS_BADGE_VARIANT[status]} className={className}>
      {MEMBER_STATUS_LABELS[status]}
    </AppBadge>
  );
}

/** Badge de statut réutilisable (table, fiche membre, demandes). */
export const MemberStatusBadge = React.memo(MemberStatusBadgeComponent);
