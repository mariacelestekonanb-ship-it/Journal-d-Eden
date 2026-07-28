"use client";

import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";

import { PageHeader } from "@/shared/components/page-header";
import { ErrorState } from "@/shared/components/states/error-state";
import { CardsLoadingState } from "@/shared/components/states/loading-state";

import { useSlotsInRange } from "../hooks/use-planning";
import { exportPlanningToExcel, exportPlanningToPdf } from "../services/planning-export.service";
import type { PlanningSlotWithRelations, PlanningView as PlanningViewType } from "../types/planning.types";
import { DaySlotsDialog } from "./day-slots-dialog";
import { ImportSlotsDialog } from "./import-slots-dialog";
import { MonthView } from "./month-view";
import { PlanningPrintView } from "./planning-print-view";
import { PlanningToolbar } from "./planning-toolbar";
import { SlotFormDialog } from "./slot-form-dialog";
import { WeekView } from "./week-view";

export function PlanningView({ isAdmin }: { isAdmin: boolean }) {
  const [view, setView] = React.useState<PlanningViewType>("semaine");
  const [referenceDate, setReferenceDate] = React.useState(() => new Date());
  const [formOpen, setFormOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [editingSlot, setEditingSlot] = React.useState<PlanningSlotWithRelations | undefined>(undefined);
  const [defaultDate, setDefaultDate] = React.useState<string | undefined>(undefined);
  const [dayDialogDate, setDayDialogDate] = React.useState<Date | null>(null);

  const rangeStart =
    view === "mois"
      ? startOfWeek(startOfMonth(referenceDate), { weekStartsOn: 1 })
      : startOfWeek(referenceDate, { weekStartsOn: 1 });
  const rangeEnd =
    view === "mois"
      ? endOfWeek(endOfMonth(referenceDate), { weekStartsOn: 1 })
      : endOfWeek(referenceDate, { weekStartsOn: 1 });

  const startDateKey = format(rangeStart, "yyyy-MM-dd");
  const endDateKey = format(rangeEnd, "yyyy-MM-dd");

  const { data: slots, isLoading, isError, refetch } = useSlotsInRange(startDateKey, endDateKey);

  function handlePrevious() {
    setReferenceDate((current) => (view === "mois" ? addMonths(current, -1) : addWeeks(current, -1)));
  }

  function handleNext() {
    setReferenceDate((current) => (view === "mois" ? addMonths(current, 1) : addWeeks(current, 1)));
  }

  function handleSlotClick(slot: PlanningSlotWithRelations) {
    if (!isAdmin) return;
    setEditingSlot(slot);
    setDefaultDate(undefined);
    setFormOpen(true);
  }

  function handleAddSlot(date: Date) {
    setEditingSlot(undefined);
    setDefaultDate(format(date, "yyyy-MM-dd"));
    setFormOpen(true);
    setDayDialogDate(null);
  }

  const rangeLabel =
    view === "mois"
      ? format(referenceDate, "MMMM yyyy", { locale: fr })
      : `Semaine du ${format(rangeStart, "d MMMM yyyy", { locale: fr })}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planning"
        description="Organisez les créneaux de prière et suivez les assignations des conducteurs."
      />

      <PlanningToolbar
        view={view}
        onViewChange={setView}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={() => setReferenceDate(new Date())}
        isAdmin={isAdmin}
        onCreateSlot={() => {
          setEditingSlot(undefined);
          setDefaultDate(undefined);
          setFormOpen(true);
        }}
        onImport={() => setImportOpen(true)}
        onExportExcel={() => exportPlanningToExcel(slots ?? [], `planning-${startDateKey}`)}
        onExportPdf={() => exportPlanningToPdf(slots ?? [], `planning-${startDateKey}`, rangeLabel)}
        onPrint={() => window.print()}
      />

      {isLoading && <CardsLoadingState count={7} />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <div className="no-print">
            {view === "semaine" ? (
              <WeekView
                weekStart={rangeStart}
                weekEnd={rangeEnd}
                slots={slots ?? []}
                isAdmin={isAdmin}
                onSlotClick={handleSlotClick}
                onAddSlot={handleAddSlot}
              />
            ) : (
              <MonthView
                monthDate={referenceDate}
                slots={slots ?? []}
                isAdmin={isAdmin}
                onSlotClick={handleSlotClick}
                onAddSlot={handleAddSlot}
                onShowMore={setDayDialogDate}
              />
            )}
          </div>
          <PlanningPrintView slots={slots ?? []} rangeLabel={rangeLabel} />
        </>
      )}

      {isAdmin && (
        <SlotFormDialog open={formOpen} onOpenChange={setFormOpen} slot={editingSlot} defaultDate={defaultDate} />
      )}

      <DaySlotsDialog
        date={dayDialogDate}
        slots={slots ?? []}
        isAdmin={isAdmin}
        onOpenChange={(open) => !open && setDayDialogDate(null)}
        onSlotClick={handleSlotClick}
        onAddSlot={handleAddSlot}
      />

      {isAdmin && (
        <ImportSlotsDialog open={importOpen} onOpenChange={setImportOpen} onImported={() => refetch()} />
      )}
    </div>
  );
}
