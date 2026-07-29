"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Trash2 } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent } from "@/shared/components/app-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { formatRelative } from "@/shared/utils/format";

import type { Notification, NotificationCallbacks } from "../types/notification.types";
import { NOTIFICATION_TYPE_ICONS } from "../utils/notification-type";
import { NotificationPriorityBadge } from "./notification-priority-badge";
import { NotificationTypeBadge } from "./notification-type-badge";

export interface NotificationCardProps {
  notification: Notification;
  callbacks: NotificationCallbacks;
  className?: string;
}

function NotificationCardComponent({ notification, callbacks, className }: NotificationCardProps) {
  const Icon = NOTIFICATION_TYPE_ICONS[notification.type];

  function handleOpen() {
    if (!notification.isRead) callbacks.onMarkRead(notification);
    callbacks.onOpen(notification);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <AppCard className={cn(!notification.isRead && "border-primary/30 bg-accent/10", className)}>
        <AppCardContent className="flex items-start gap-3 p-4">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted",
              !notification.isRead && "bg-accent",
            )}
            aria-hidden="true"
          >
            <Icon className="size-4 text-muted-foreground" />
          </span>

          <button
            type="button"
            onClick={handleOpen}
            className="min-w-0 flex-1 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">{notification.title}</span>
              {!notification.isRead && <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <NotificationTypeBadge type={notification.type} />
              <NotificationPriorityBadge priority={notification.priority} />
              <span className="text-xs text-muted-foreground">{formatRelative(notification.createdAt)}</span>
            </div>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AppButton variant="ghost" size="icon" aria-label={`Actions pour ${notification.title}`}>
                <MoreHorizontal className="size-4" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.isRead && (
                <DropdownMenuItem onSelect={() => callbacks.onMarkRead(notification)}>Marquer comme lu</DropdownMenuItem>
              )}
              {notification.actionUrl && (
                <DropdownMenuItem onSelect={() => callbacks.onOpen(notification)}>Ouvrir</DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => callbacks.onDelete(notification)}>
                <Trash2 className="size-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </AppCardContent>
      </AppCard>
    </motion.div>
  );
}

/** Carte d'une notification — icône, titre, message, date, priorité, statut de lecture, actions rapides. */
export const NotificationCard = React.memo(NotificationCardComponent);
