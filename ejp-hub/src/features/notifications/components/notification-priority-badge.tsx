import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";

import type { NotificationPriority } from "../types/notification.types";
import { NOTIFICATION_PRIORITY_BADGE_VARIANT, NOTIFICATION_PRIORITY_LABELS } from "../utils/notification-priority";

export interface NotificationPriorityBadgeProps {
  priority: NotificationPriority;
  className?: string;
}

function NotificationPriorityBadgeComponent({ priority, className }: NotificationPriorityBadgeProps) {
  return (
    <AppBadge variant={NOTIFICATION_PRIORITY_BADGE_VARIANT[priority]} className={className}>
      {NOTIFICATION_PRIORITY_LABELS[priority]}
    </AppBadge>
  );
}

/** Badge de priorité réutilisable (carte, tableau, filtres). */
export const NotificationPriorityBadge = React.memo(NotificationPriorityBadgeComponent);
