"use client";

import { Bell, CheckCheck } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { AppEmptyState } from "@/shared/components/app-empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

import {
  useDashboardNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "../../hooks/use-notifications";
import { DashboardCard } from "../dashboard-card";
import { NotificationCard } from "../notification-card";

export interface NotificationsPanelProps {
  userId: string;
}

/** Panneau Notifications : marquer une notification (ou toutes) comme lue. */
export function NotificationsPanel({ userId }: NotificationsPanelProps) {
  const { data: notifications, isLoading } = useDashboardNotifications(userId);
  const markAsRead = useMarkNotificationAsRead(userId);
  const markAllAsRead = useMarkAllNotificationsAsRead(userId);

  const hasUnread = notifications?.some((notification) => !notification.readAt);

  return (
    <DashboardCard
      title="Notifications"
      icon={Bell}
      delay={0.2}
      action={
        hasUnread ? (
          <AppButton
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => markAllAsRead.mutate()}
            isLoading={markAllAsRead.isPending}
            aria-label="Tout marquer comme lu"
          >
            <CheckCheck className="size-3.5" />
            Tout marquer comme lu
          </AppButton>
        ) : undefined
      }
    >
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}
      {!isLoading && notifications?.length === 0 && (
        <AppEmptyState icon={Bell} title="Aucune notification" description="Vous êtes à jour !" />
      )}
      {!isLoading && notifications && notifications.length > 0 && (
        <div className="space-y-1">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={(id) => markAsRead.mutate(id)}
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
