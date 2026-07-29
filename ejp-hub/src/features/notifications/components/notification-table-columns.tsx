import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { AppBadge } from "@/shared/components/app-badge";
import { AppButton } from "@/shared/components/app-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatDateTime } from "@/shared/utils/format";

import type { Notification, NotificationCallbacks } from "../types/notification.types";
import { NOTIFICATION_PRIORITY_WEIGHT } from "../utils/notification-priority";
import { NotificationPriorityBadge } from "./notification-priority-badge";
import { NotificationTypeBadge } from "./notification-type-badge";

export function getNotificationTableColumns(callbacks: NotificationCallbacks): ColumnDef<Notification>[] {
  return [
    {
      id: "status",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) =>
        !row.original.isRead && <span className="block size-2 rounded-full bg-primary" aria-label="Non lue" />,
    },
    {
      id: "title",
      accessorFn: (row) => row.title,
      header: "Notification",
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-medium text-foreground">{row.original.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.message}</p>
        </div>
      ),
    },
    {
      id: "type",
      accessorFn: (row) => row.type,
      header: "Type",
      cell: ({ row }) => <NotificationTypeBadge type={row.original.type} />,
    },
    {
      id: "priority",
      accessorFn: (row) => NOTIFICATION_PRIORITY_WEIGHT[row.priority],
      header: "Priorité",
      cell: ({ row }) => <NotificationPriorityBadge priority={row.original.priority} />,
    },
    {
      id: "read",
      accessorFn: (row) => row.isRead,
      header: "Statut",
      cell: ({ row }) => <AppBadge variant={row.original.isRead ? "secondary" : "default"}>{row.original.isRead ? "Lue" : "Non lue"}</AppBadge>,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AppButton variant="ghost" size="icon" aria-label={`Actions pour ${notification.title}`}>
                <MoreHorizontal className="size-4" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  if (!notification.isRead) callbacks.onMarkRead(notification);
                  callbacks.onOpen(notification);
                }}
              >
                <Eye className="size-4" />
                Ouvrir
              </DropdownMenuItem>
              {!notification.isRead && (
                <DropdownMenuItem onSelect={() => callbacks.onMarkRead(notification)}>Marquer comme lu</DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => callbacks.onDelete(notification)}>
                <Trash2 className="size-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
