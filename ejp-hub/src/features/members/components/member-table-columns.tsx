import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, MoreHorizontal, RotateCcw, ShieldAlert, Trash2, XCircle } from "lucide-react";

import { AppAvatar } from "@/shared/components/app-avatar";
import { AppButton } from "@/shared/components/app-button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatDate } from "@/shared/utils/format";

import { MemberWorkflowService } from "../services/member-workflow.service";
import type { Member, MemberCallbacks } from "../types/member.types";
import type { MemberPermissions } from "../utils/member-permissions";
import { MemberRoleBadge } from "./member-role-badge";
import { MemberStatusBadge } from "./member-status-badge";

export function getMemberTableColumns(permissions: MemberPermissions, callbacks: MemberCallbacks): ColumnDef<Member>[] {
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
          aria-label={`Sélectionner ${row.original.fullName}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "photo",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <AppAvatar name={row.original.fullName} src={row.original.photoUrl} className="size-8" />,
    },
    {
      id: "name",
      accessorFn: (row) => row.fullName,
      header: "Nom",
      cell: ({ row }) => (
        <div>
          <p className={`font-medium ${row.original.deletedAt ? "text-muted-foreground" : "text-foreground"}`}>
            {row.original.fullName}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      id: "phone",
      accessorFn: (row) => row.phone ?? "",
      header: "Téléphone",
      cell: ({ row }) => row.original.phone ?? "—",
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => <MemberStatusBadge status={row.original.status} deletedAt={row.original.deletedAt} />,
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Rôle",
      cell: ({ row }) => <MemberRoleBadge role={row.original.role} />,
    },
    {
      id: "registeredAt",
      accessorKey: "registeredAt",
      header: "Date d'inscription",
      cell: ({ row }) => formatDate(row.original.registeredAt, "dd/MM/yyyy"),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const member = row.original;
        const canAccept = permissions.canValidate && MemberWorkflowService.isAcceptable(member.status);
        const canRefuse = permissions.canRefuse && MemberWorkflowService.isRefusable(member.status);
        const canSuspend = permissions.canSuspend && MemberWorkflowService.isSuspendable(member.status);
        const canReactivate = permissions.canReactivate && MemberWorkflowService.isReactivatable(member.status);
        const canDelete = permissions.canDelete && MemberWorkflowService.isDeletable(member.deletedAt);
        const canRestore = permissions.canDelete && MemberWorkflowService.isRestorable(member.deletedAt);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AppButton variant="ghost" size="icon" aria-label={`Actions pour ${member.fullName}`}>
                <MoreHorizontal className="size-4" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => callbacks.onView(member)}>
                <Eye className="size-4" />
                Consulter
              </DropdownMenuItem>
              {canAccept && (
                <DropdownMenuItem onSelect={() => callbacks.onAccept(member)}>
                  <CheckCircle2 className="size-4" />
                  Accepter
                </DropdownMenuItem>
              )}
              {canRefuse && (
                <DropdownMenuItem onSelect={() => callbacks.onRefuse(member)}>
                  <XCircle className="size-4" />
                  Refuser
                </DropdownMenuItem>
              )}
              {canSuspend && (
                <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => callbacks.onSuspend(member)}>
                  <ShieldAlert className="size-4" />
                  Suspendre
                </DropdownMenuItem>
              )}
              {canReactivate && (
                <DropdownMenuItem onSelect={() => callbacks.onReactivate(member)}>
                  <RotateCcw className="size-4" />
                  Réactiver
                </DropdownMenuItem>
              )}
              {canRestore && (
                <DropdownMenuItem onSelect={() => callbacks.onRestore(member)}>
                  <RotateCcw className="size-4" />
                  Restaurer
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => callbacks.onDelete(member)}>
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
