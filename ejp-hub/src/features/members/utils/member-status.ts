import type { AppBadgeProps } from "@/shared/components/app-badge";

import type { MemberStatus } from "../types/member.types";

/** Source unique des libellés et couleurs de statut — utilisée par le badge, les filtres et les pages. */
export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  PENDING: "En attente",
  ACTIVE: "Actif",
  REFUSED: "Refusé",
  SUSPENDED: "Suspendu",
};

export const MEMBER_STATUS_BADGE_VARIANT: Record<MemberStatus, NonNullable<AppBadgeProps["variant"]>> = {
  PENDING: "warning",
  ACTIVE: "success",
  REFUSED: "destructive",
  SUSPENDED: "secondary",
};

export const MEMBER_STATUS_OPTIONS: MemberStatus[] = ["PENDING", "ACTIVE", "REFUSED", "SUSPENDED"];
