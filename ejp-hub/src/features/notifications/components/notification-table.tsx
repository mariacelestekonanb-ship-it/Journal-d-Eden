"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard } from "@/shared/components/app-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import type { Notification, NotificationCallbacks } from "../types/notification.types";
import { NotificationEmptyState } from "./notification-empty-state";
import { getNotificationTableColumns } from "./notification-table-columns";

export interface NotificationTableProps {
  notifications: Notification[];
  callbacks: NotificationCallbacks;
}

/** Vue tableau des notifications — tri, pagination. Alternative à `NotificationList` (regroupement chronologique). */
export function NotificationTable({ notifications, callbacks }: NotificationTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);

  const columns = React.useMemo(() => getNotificationTableColumns(callbacks), [callbacks]);

  const table = useReactTable({
    data: notifications,
    columns,
    state: { sorting },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (notifications.length === 0) {
    return <NotificationEmptyState />;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Maj+clic sur une colonne pour trier sur plusieurs critères.</p>

      <AppCard className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? null}
                        {header.column.getSortIndex() > -1 && table.getState().sorting.length > 1 && (
                          <sup>{header.column.getSortIndex() + 1}</sup>
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={row.original.isRead ? undefined : "bg-accent/10"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppCard>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Page {table.getState().pagination.pageIndex + 1} sur {Math.max(table.getPageCount(), 1)} · {notifications.length}{" "}
          notification{notifications.length > 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            size="icon"
            aria-label="Page précédente"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </AppButton>
          <AppButton
            variant="outline"
            size="icon"
            aria-label="Page suivante"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </AppButton>
        </div>
      </div>
    </div>
  );
}
