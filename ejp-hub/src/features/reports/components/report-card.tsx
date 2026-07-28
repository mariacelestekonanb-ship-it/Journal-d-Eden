"use client";

import { FileDown, FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import * as React from "react";

import { formatDate, formatTime } from "@/lib/format";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { exportReportToPdf, exportReportToWord } from "../services/report-export.service";
import type { ReportWithSlot } from "../types/report.types";

export function ReportCard({
  report,
  canEdit,
  canDelete,
  showConducteur,
  onEdit,
  onDelete,
}: {
  report: ReportWithSlot;
  canEdit: boolean;
  canDelete: boolean;
  showConducteur: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 space-y-1">
          <p className="font-medium text-foreground">
            {formatDate(report.slot.slot_date, "dd/MM/yyyy")} · {formatTime(report.slot.start_time)}–
            {formatTime(report.slot.end_time)}
          </p>
          {showConducteur && <p className="text-sm text-muted-foreground">{report.conducteur.full_name}</p>}
          {report.slot.topic && <p className="text-sm text-muted-foreground">{report.slot.topic.title}</p>}
          <p className="line-clamp-2 text-sm text-muted-foreground">{report.content}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Actions" className="shrink-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEdit && (
              <DropdownMenuItem onSelect={onEdit}>
                <Pencil className="size-4" />
                Modifier
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => exportReportToPdf(report)}>
              <FileDown className="size-4" />
              Exporter en PDF
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exportReportToWord(report)}>
              <FileText className="size-4" />
              Exporter en Word
            </DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
                <Trash2 className="size-4" />
                Supprimer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
