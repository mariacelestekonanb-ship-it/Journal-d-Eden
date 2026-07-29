import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";

import type { NotificationType } from "../types/notification.types";
import { NOTIFICATION_TYPE_ICONS, NOTIFICATION_TYPE_LABELS } from "../utils/notification-type";

export interface NotificationTypeBadgeProps {
  type: NotificationType;
  className?: string;
}

function NotificationTypeBadgeComponent({ type, className }: NotificationTypeBadgeProps) {
  const Icon = NOTIFICATION_TYPE_ICONS[type];
  return (
    <AppBadge variant="outline" className={className}>
      <Icon className="mr-1 size-3" aria-hidden="true" />
      {NOTIFICATION_TYPE_LABELS[type]}
    </AppBadge>
  );
}

/** Badge de type réutilisable (carte, tableau, filtres) — icône cohérente avec la barre latérale. */
export const NotificationTypeBadge = React.memo(NotificationTypeBadgeComponent);
