import { CheckCheck } from "lucide-react";
import Link from "next/link";

import { AppButton } from "@/shared/components/app-button";
import { formatRelative } from "@/shared/utils/format";

import type { Notification } from "../types/notification.types";
import { NOTIFICATION_TYPE_ICONS } from "../utils/notification-type";
import { NotificationEmptyState } from "./notification-empty-state";

export interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  onOpen: (notification: Notification) => void;
  onMarkAllRead: () => void;
  isMarkingAllRead: boolean;
}

const PREVIEW_LIMIT = 5;

/** Contenu du menu déroulant du `NotificationBell` — aperçu des dernières notifications, accès rapide au centre. */
export function NotificationDropdown({ notifications, isLoading, onOpen, onMarkAllRead, isMarkingAllRead }: NotificationDropdownProps) {
  const preview = notifications.slice(0, PREVIEW_LIMIT);
  const hasUnread = notifications.some((notification) => !notification.isRead);

  return (
    <div className="w-80 max-w-[90vw]">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-semibold text-foreground">Notifications</p>
        {hasUnread && (
          <AppButton
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={onMarkAllRead}
            isLoading={isMarkingAllRead}
          >
            <CheckCheck className="size-3.5" />
            Tout marquer comme lu
          </AppButton>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto px-1 pb-1">
        {isLoading && <p className="px-2 py-4 text-center text-sm text-muted-foreground">Chargement…</p>}
        {!isLoading && preview.length === 0 && (
          <div className="p-2">
            <NotificationEmptyState />
          </div>
        )}
        {!isLoading &&
          preview.map((notification) => {
            const Icon = NOTIFICATION_TYPE_ICONS[notification.type];
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => onOpen(notification)}
                className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">
                  <Icon className="size-3.5 text-muted-foreground" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-foreground">{notification.title}</span>
                    {!notification.isRead && <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{notification.message}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">{formatRelative(notification.createdAt)}</span>
                </span>
              </button>
            );
          })}
      </div>

      <div className="border-t border-border p-2">
        <Link
          href="/notifications"
          className="block rounded-lg p-2 text-center text-sm font-medium text-primary hover:bg-muted/60"
        >
          Voir toutes les notifications
        </Link>
      </div>
    </div>
  );
}
