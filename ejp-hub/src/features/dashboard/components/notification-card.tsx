"use client";

import { motion } from "framer-motion";
import { Bell, CalendarClock, FileClock, HeartHandshake, type LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { formatRelative } from "@/shared/utils/format";
import type { NotificationType } from "@/shared/types/database";

import type { DashboardNotification } from "../types/dashboard.types";

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  UPCOMING_SLOT: CalendarClock,
  PENDING_REPORT: FileClock,
  NEW_TOPIC: HeartHandshake,
};

export interface NotificationCardProps {
  notification: DashboardNotification;
  onMarkAsRead: (id: string) => void;
}

/** Une notification du panneau Dashboard — cliquable pour la marquer comme lue. */
export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const Icon = TYPE_ICON[notification.type] ?? Bell;
  const isUnread = !notification.readAt;

  return (
    <motion.button
      type="button"
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      onClick={() => isUnread && onMarkAsRead(notification.id)}
      aria-label={`${notification.title}${isUnread ? " (non lue, cliquer pour marquer comme lue)" : " (lue)"}`}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-transparent p-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isUnread && "border-primary/20 bg-accent/20",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">
        <Icon className="size-4 text-muted-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{notification.title}</span>
          {isUnread && <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{notification.message}</span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">
          {formatRelative(notification.createdAt)}
        </span>
      </span>
    </motion.button>
  );
}
