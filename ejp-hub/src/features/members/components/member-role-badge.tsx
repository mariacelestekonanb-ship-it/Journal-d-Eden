import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";
import { ROLE_LABELS } from "@/shared/constants/roles";

import type { MemberRole } from "../types/member.types";

export interface MemberRoleBadgeProps {
  role: MemberRole;
  className?: string;
}

function MemberRoleBadgeComponent({ role, className }: MemberRoleBadgeProps) {
  return (
    <AppBadge variant={role === "ADMIN" ? "default" : "outline"} className={className}>
      {ROLE_LABELS[role]}
    </AppBadge>
  );
}

/** Badge de rôle réutilisable — libellés partagés avec le reste de l'application (`ROLE_LABELS`). */
export const MemberRoleBadge = React.memo(MemberRoleBadgeComponent);
