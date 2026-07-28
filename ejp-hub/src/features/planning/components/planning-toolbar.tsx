"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, FileDown, FileSpreadsheet, Plus, Printer, Upload } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import type { PlanningView } from "../types/planning.types";

interface PlanningToolbarProps {
  view: PlanningView;
  onViewChange: (view: PlanningView) => void;
  rangeStart: Date;
  rangeEnd: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  isAdmin: boolean;
  onCreateSlot: () => void;
  onImport: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
}

export function PlanningToolbar({
  view,
  onViewChange,
  rangeStart,
  rangeEnd,
  onPrevious,
  onNext,
  onToday,
  isAdmin,
  onCreateSlot,
  onImport,
  onExportExcel,
  onExportPdf,
  onPrint,
}: PlanningToolbarProps) {
  const rangeLabel =
    view === "mois"
      ? format(rangeStart, "MMMM yyyy", { locale: fr })
      : `${format(rangeStart, "d MMM", { locale: fr })} – ${format(rangeEnd, "d MMM yyyy", { locale: fr })}`;

  return (
    <div className="no-print flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <Tabs value={view} onValueChange={(value) => onViewChange(value as PlanningView)}>
          <TabsList>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={onPrevious} aria-label="Période précédente">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Aujourd&apos;hui
          </Button>
          <Button variant="outline" size="icon" onClick={onNext} aria-label="Période suivante">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <p className="min-w-40 text-sm font-medium capitalize text-foreground">{rangeLabel}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExportExcel}>
          <FileSpreadsheet className="size-4" />
          Excel
        </Button>
        <Button variant="outline" size="sm" onClick={onExportPdf}>
          <FileDown className="size-4" />
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={onPrint}>
          <Printer className="size-4" />
          Imprimer
        </Button>
        {isAdmin && (
          <>
            <Button variant="outline" size="sm" onClick={onImport}>
              <Upload className="size-4" />
              Importer
            </Button>
            <Button size="sm" onClick={onCreateSlot}>
              <Plus className="size-4" />
              Nouveau créneau
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
