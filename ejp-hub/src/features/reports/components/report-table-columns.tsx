import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Send, Trash2 } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatDate, formatRelative, formatTime } from "@/shared/utils/format";

import { ReportWorkflowService } from "../services/report-workflow.service";
import type { Report, ReportCallbacks } from "../types/report.types";
import type { ReportPermissions } from "../utils/report-permissions";
import { ReportStatusBadge } from "./report-status-badge";

export function getReportTableColumns(
  permissions: ReportPermissions,
  currentUserId: string,
  callbacks: ReportCallbacks,
): ColumnDef<Report>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Tout sélectionner"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Sélectionner le CR de ${row.original.planningSlot.title}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "date",
      accessorFn: (row) => row.planningSlot.date,
      header: "Date",
      cell: ({ row }) => formatDate(row.original.planningSlot.date, "dd/MM/yyyy"),
    },
    {
      id: "slot",
      accessorFn: (row) => row.planningSlot.title,
      header: "Créneau",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-foreground">{row.original.planningSlot.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(row.original.planningSlot.startTime)}–{formatTime(row.original.planningSlot.endTime)}
          </p>
        </div>
      ),
    },
    {
      id: "leader",
      accessorFn: (row) => row.leader.fullName,
      header: "Conducteur",
      cell: ({ row }) => row.original.leader.fullName,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => <ReportStatusBadge status={row.original.status} />,
    },
    {
      id: "connected",
      accessorFn: (row) => row.generalInfo.connectedCount ?? -1,
      header: "Connectés",
      cell: ({ row }) => row.original.generalInfo.connectedCount ?? "—",
    },
    {
      id: "author",
      accessorFn: (row) => row.authorName,
      header: "Auteur",
      cell: ({ row }) => row.original.authorName,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Dernière modification",
      cell: ({ row }) => formatRelative(row.original.updatedAt),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const report = row.original;
        const isOwner = report.authorId === currentUserId;
        const canEdit = isOwner && ReportWorkflowService.isEditable(report.status);
        const canSubmit = isOwner && ReportWorkflowService.isSubmittable(report.status);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AppButton variant="ghost" size="icon" aria-label={`Actions pour le CR de ${report.planningSlot.title}`}>
                <MoreHorizontal className="size-4" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => callbacks.onView(report)}>
                <Eye className="size-4" />
                Consulter
              </DropdownMenuItem>
              {canEdit && (
                <DropdownMenuItem onSelect={() => callbacks.onEdit(report)}>
                  <Pencil className="size-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {canSubmit && (
                <DropdownMenuItem onSelect={() => callbacks.onSubmit(report)}>
                  <Send className="size-4" />
                  Soumettre
                </DropdownMenuItem>
              )}
              {permissions.canDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => callbacks.onDelete(report)}
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
