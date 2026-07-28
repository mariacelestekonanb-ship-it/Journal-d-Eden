"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";

import {
  useMarkAllNotificationsAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/features/notifications/hooks/use-notifications";
import { formatRelative } from "@/lib/format";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

export function NotificationsBell() {
  const { data: unreadCount } = useUnreadNotificationsCount();
  const { data: notifications, isLoading } = useNotifications();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {!!unreadCount && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">Notifications</p>
          {!!unreadCount && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => markAllAsRead.mutate()}
            >
              <CheckCheck className="size-3.5" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading && <p className="p-4 text-sm text-muted-foreground">Chargement…</p>}
          {!isLoading && notifications?.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Aucune notification pour le moment.</p>
          )}
          {notifications?.map((notification) => (
            <Link
              key={notification.id}
              href={notification.link ?? "/notifications"}
              className="flex flex-col gap-0.5 border-b border-border px-4 py-3 text-sm transition-colors last:border-0 hover:bg-muted/50"
            >
              <span className="flex items-center gap-2 font-medium">
                {!notification.read_at && <span className="size-1.5 rounded-full bg-primary" />}
                {notification.title}
              </span>
              <span className="text-xs text-muted-foreground">{notification.message}</span>
              <span className="text-[11px] text-muted-foreground">
                {formatRelative(notification.created_at)}
              </span>
            </Link>
          ))}
        </div>
        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/notifications">Voir toutes les notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
