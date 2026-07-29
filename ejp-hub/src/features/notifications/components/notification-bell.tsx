"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppButton } from "@/shared/components/app-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { useMarkAllNotificationsRead, useMarkNotificationRead } from "../hooks/use-notification-mutations";
import { useNotificationListContext, useNotifications } from "../hooks/use-notifications";
import type { Notification } from "../types/notification.types";
import { NotificationDropdown } from "./notification-dropdown";

/** Icône Notifications du Header — compteur non lus, menu déroulant, accès rapide au centre. */
export function NotificationBell() {
  const router = useRouter();
  const context = useNotificationListContext();
  const { data: notifications, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const unreadCount = (notifications ?? []).filter((notification) => !notification.isRead).length;

  function handleOpen(notification: Notification) {
    if (!notification.isRead && context) {
      markReadMutation.mutate({ id: notification.id, context });
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton variant="ghost" size="icon" className="relative" aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ""}`}>
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span
              className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground"
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-0">
        <NotificationDropdown
          notifications={notifications ?? []}
          isLoading={isLoading}
          onOpen={handleOpen}
          onMarkAllRead={() => context && markAllReadMutation.mutate(context)}
          isMarkingAllRead={markAllReadMutation.isPending}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
