import type { AppBadgeProps } from "@/shared/components/app-badge";

import type { AssignmentResponse } from "../types/planning.types";

export const ASSIGNMENT_RESPONSE_LABELS: Record<AssignmentResponse, string> = {
  PENDING: "En attente de réponse",
  ACCEPTED: "Accepté",
  DECLINED: "Refusé",
};

export const ASSIGNMENT_RESPONSE_BADGE_VARIANT: Record<AssignmentResponse, NonNullable<AppBadgeProps["variant"]>> = {
  PENDING: "secondary",
  ACCEPTED: "success",
  DECLINED: "destructive",
};
