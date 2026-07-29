"use client";

import { CheckCheck } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { NotificationFilters } from "../components/notification-filters";
import { NotificationList } from "../components/notification-list";
import { NotificationStats } from "../components/notification-stats";
import { NotificationTable } from "../components/notification-table";
import { useMarkAllNotificationsRead, useDeleteNotification, useMarkNotificationRead } from "../hooks/use-notification-mutations";
import { useNotificationStats } from "../hooks/use-notification-stats";
import { useNotificationListContext, useNotifications } from "../hooks/use-notifications";
import { applyNotificationFilters, useNotificationsFilters } from "../hooks/use-notifications-filters";
import { useNotificationsView } from "../hooks/use-notifications-view";
import type { Notification } from "../types/notification.types";

const NotificationTypeBreakdownChart = dynamic(
  () => import("../components/notification-type-breakdown-chart").then((mod) => mod.NotificationTypeBreakdownChart),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full" /> },
);

/** Centre de notifications — statistiques, filtres combinables, vue liste groupée ou tableau. */
export function NotificationsView() {
  const router = useRouter();
  const context = useNotificationListContext();

  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const { stats, isLoading: isStatsLoading } = useNotificationStats();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useNotificationsFilters();
  const [view, setView] = useNotificationsView();
  const [notificationToDelete, setNotificationToDelete] = React.useState<Notification | null>(null);

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const filteredNotifications = React.useMemo(
    () => applyNotificationFilters(notifications ?? [], filters),
    [notifications, filters],
  );
  const hasUnread = (notifications ?? []).some((notification) => !notification.isRead);

  const callbacks = React.useMemo(
    () => ({
      onOpen: (notification: Notification) => {
        if (notification.actionUrl) router.push(notification.actionUrl);
      },
      onMarkRead: (notification: Notification) => context && markReadMutation.mutate({ id: notification.id, context }),
      onDelete: (notification: Notification) => setNotificationToDelete(notification),
    }),
    [router, context, markReadMutation],
  );

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Notifications"
        description="Centralise tous les événements importants qui vous concernent."
        actions={
          hasUnread ? (
            <AppButton variant="outline" isLoading={markAllReadMutation.isPending} onClick={() => context && markAllReadMutation.mutate(context)}>
              <CheckCheck className="size-4" />
              Tout marquer comme lu
            </AppButton>
          ) : undefined
        }
      />

      <NotificationStats stats={stats} isLoading={isStatsLoading} />

      <AppCard className="p-4">
        <AppCardHeader className="p-0 pb-2">
          <AppCardTitle className="text-sm font-medium text-muted-foreground">Répartition par type</AppCardTitle>
        </AppCardHeader>
        <AppCardContent className="p-0">
          <NotificationTypeBreakdownChart byType={stats.byType} />
        </AppCardContent>
      </AppCard>

      <NotificationFilters filters={filters} onChange={updateFilter} onReset={resetFilters} hasActiveFilters={hasActiveFilters} />

      <Tabs value={view} onValueChange={(value) => setView(value as typeof view)}>
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="table">Tableau</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">Impossible de charger les notifications pour le moment.</p>
          <AppButton variant="outline" size="sm" onClick={() => refetch()}>
            Réessayer
          </AppButton>
        </div>
      )}

      {!isLoading && !isError && view === "list" && (
        <NotificationList notifications={filteredNotifications} callbacks={callbacks} />
      )}
      {!isLoading && !isError && view === "table" && (
        <NotificationTable notifications={filteredNotifications} callbacks={callbacks} />
      )}

      <ConfirmDialog
        open={!!notificationToDelete}
        onOpenChange={(open) => !open && setNotificationToDelete(null)}
        title="Supprimer cette notification ?"
        description={`« ${notificationToDelete?.title} » sera définitivement supprimée.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!notificationToDelete || !context) return;
          await deleteMutation.mutateAsync({ id: notificationToDelete.id, context });
          setNotificationToDelete(null);
        }}
      />
    </div>
  );
}
