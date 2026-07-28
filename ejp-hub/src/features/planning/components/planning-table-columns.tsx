import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, MoreHorizontal, Pencil, Trash2, XCircle } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatDate, formatTime } from "@/shared/utils/format";

import type { PrayerSlot } from "../types/planning.types";
import type { PlanningPermissions } from "../utils/planning-permissions";
import { PlanningStatusBadge } from "./planning-status-badge";

export interface PlanningTableCallbacks {
  onView: (slot: PrayerSlot) => void;
  onEdit: (slot: PrayerSlot) => void;
  onDuplicate: (slot: PrayerSlot) => void;
  onCancel: (slot: PrayerSlot) => void;
  onDelete: (slot: PrayerSlot) => void;
}

export function getPlanningTableColumns(
  permissions: PlanningPermissions,
  callbacks: PlanningTableCallbacks,
): ColumnDef<PrayerSlot>[] {
  return [
    {
      id: "date",
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.date, "dd/MM/yyyy"),
    },
    {
      id: "schedule",
      header: "Horaire",
      accessorFn: (row) => `${row.startTime}-${row.endTime}`,
      cell: ({ row }) => `${formatTime(row.original.startTime)}–${formatTime(row.original.endTime)}`,
      enableSorting: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-foreground">{row.original.title}</p>
          {row.original.theme && <p className="text-xs text-muted-foreground">{row.original.theme}</p>}
        </div>
      ),
    },
    {
      id: "location",
      accessorFn: (row) => row.location ?? "",
      header: "Lieu",
      cell: ({ row }) => row.original.location ?? "—",
    },
    {
      id: "primaryLeader",
      accessorFn: (row) => row.primaryLeader?.fullName ?? "",
      header: "Conducteur principal",
      cell: ({ row }) => row.original.primaryLeader?.fullName ?? "Non assigné",
    },
    {
      id: "secondaryLeader",
      accessorFn: (row) => row.secondaryLeader?.fullName ?? "",
      header: "Conducteur secondaire",
      cell: ({ row }) => row.original.secondaryLeader?.fullName ?? "—",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => <PlanningStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const slot = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AppButton variant="ghost" size="icon" aria-label={`Actions pour ${slot.title}`}>
                <MoreHorizontal className="size-4" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => callbacks.onView(slot)}>
                <Eye className="size-4" />
                Consulter
              </DropdownMenuItem>
              {permissions.canEdit && (
                <DropdownMenuItem onSelect={() => callbacks.onEdit(slot)}>
                  <Pencil className="size-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {permissions.canDuplicate && (
                <DropdownMenuItem onSelect={() => callbacks.onDuplicate(slot)}>
                  <Copy className="size-4" />
                  Dupliquer
                </DropdownMenuItem>
              )}
              {permissions.canCancel && slot.status !== "CANCELLED" && (
                <DropdownMenuItem onSelect={() => callbacks.onCancel(slot)}>
                  <XCircle className="size-4" />
                  Annuler
                </DropdownMenuItem>
              )}
              {permissions.canDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => callbacks.onDelete(slot)}
                >
                  <Trash2 className="size-4" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
