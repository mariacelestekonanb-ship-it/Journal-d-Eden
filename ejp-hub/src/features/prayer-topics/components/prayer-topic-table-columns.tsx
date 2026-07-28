import type { ColumnDef } from "@tanstack/react-table";
import { Archive, ArchiveRestore, Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatDate } from "@/shared/utils/format";

import type { PrayerTopic, PrayerTopicCallbacks } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_CATEGORY_CONFIG } from "../utils/prayer-topic-category";
import type { PrayerTopicPermissions } from "../utils/prayer-topic-permissions";
import { PrayerTopicPriorityBadge } from "./prayer-topic-priority-badge";
import { PrayerTopicStatusBadge } from "./prayer-topic-status-badge";

export function getPrayerTopicTableColumns(
  permissions: PrayerTopicPermissions,
  callbacks: PrayerTopicCallbacks,
): ColumnDef<PrayerTopic>[] {
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
          aria-label={`Sélectionner ${row.original.title}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-foreground">{row.original.title}</p>
          {row.original.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground">{row.original.description}</p>
          )}
        </div>
      ),
    },
    {
      id: "category",
      accessorFn: (row) => PRAYER_TOPIC_CATEGORY_CONFIG[row.category].label,
      header: "Catégorie",
      cell: ({ row }) => PRAYER_TOPIC_CATEGORY_CONFIG[row.original.category].label,
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: "Priorité",
      cell: ({ row }) => <PrayerTopicPriorityBadge priority={row.original.priority} />,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => <PrayerTopicStatusBadge status={row.original.status} />,
    },
    {
      id: "startDate",
      accessorKey: "startDate",
      header: "Date début",
      cell: ({ row }) => formatDate(row.original.startDate, "dd/MM/yyyy"),
    },
    {
      id: "endDate",
      accessorFn: (row) => row.endDate ?? "",
      header: "Date fin",
      cell: ({ row }) => (row.original.endDate ? formatDate(row.original.endDate, "dd/MM/yyyy") : "—"),
    },
    {
      id: "author",
      accessorKey: "authorName",
      header: "Auteur",
      cell: ({ row }) => row.original.authorName,
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const topic = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AppButton variant="ghost" size="icon" aria-label={`Actions pour ${topic.title}`}>
                <MoreHorizontal className="size-4" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => callbacks.onView(topic)}>
                <Eye className="size-4" />
                Consulter
              </DropdownMenuItem>
              {permissions.canEdit && (
                <DropdownMenuItem onSelect={() => callbacks.onEdit(topic)}>
                  <Pencil className="size-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {permissions.canDuplicate && (
                <DropdownMenuItem onSelect={() => callbacks.onDuplicate(topic)}>
                  <Copy className="size-4" />
                  Dupliquer
                </DropdownMenuItem>
              )}
              {permissions.canArchive && topic.status !== "ARCHIVED" && (
                <DropdownMenuItem onSelect={() => callbacks.onArchive(topic)}>
                  <Archive className="size-4" />
                  Archiver
                </DropdownMenuItem>
              )}
              {permissions.canRestore && topic.status === "ARCHIVED" && (
                <DropdownMenuItem onSelect={() => callbacks.onRestore(topic)}>
                  <ArchiveRestore className="size-4" />
                  Restaurer
                </DropdownMenuItem>
              )}
              {permissions.canDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => callbacks.onDelete(topic)}
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
