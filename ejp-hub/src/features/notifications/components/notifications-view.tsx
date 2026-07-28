"use client";

import { Bell, BellRing, Calendar, CheckCheck, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/states/empty-state";
import { ErrorState } from "@/shared/components/states/error-state";
import { TableLoadingState } from "@/shared/components/states/loading-state";
import { Button } from "@/shared/components/ui/button";

import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from "../hooks/use-notifications";
import type { Notification } from "../types/notification.types";
import type { NotificationType } from "@/types/database";

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  creneau_a_venir: Calendar,
  cr_en_attente: FileText,
  nouveau_sujet: Sparkles,
};

export function NotificationsView() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const hasUnread = notifications?.some((notification) => !notification.read_at);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Prochains temps de prière, comptes rendus en attente et nouveaux sujets de prière."
        actions={
          hasUnread ? (
            <Button variant="outline" size="sm" onClick={() => markAllAsRead.mutate()}>
              <CheckCheck className="size-4" />
              Tout marquer comme lu
            </Button>
          ) : undefined
        }
      />

      {isLoading && <TableLoadingState rows={5} />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {notifications && notifications.length === 0 && (
        <EmptyState
          icon={Bell}
          title="Aucune notification"
          description="Vous êtes à jour ! Les prochains créneaux et sujets apparaîtront ici."
        />
      )}

      <div className="space-y-2">
        {notifications?.map((notification: Notification) => {
          const Icon = TYPE_ICON[notification.type] ?? BellRing;
          return (
            <Link
              key={notification.id}
              href={notification.link ?? "/notifications"}
              onClick={() => !notification.read_at && markAsRead.mutate(notification.id)}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40",
                !notification.read_at && "border-primary/30 bg-accent/20",
              )}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-medium text-foreground">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{formatRelative(notification.created_at)}</p>
              </div>
              {!notification.read_at && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
