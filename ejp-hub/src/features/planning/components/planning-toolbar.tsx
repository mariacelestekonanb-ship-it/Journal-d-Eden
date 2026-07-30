import { CalendarRange, FileDown, LayoutGrid, List as ListIcon, Rows3, Upload, Users } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import type { PlanningViewMode } from "../types/planning.types";

export interface PlanningToolbarProps {
  view: PlanningViewMode;
  onViewChange: (view: PlanningViewMode) => void;
  onExport: () => void;
  /** Absent pour un rôle sans droit de création (pas d'import possible sans droit de créer un créneau). */
  onImport?: () => void;
}

/** Barre d'outils du Planning : bascule entre les 5 onglets, export/import CSV (masqués sur l'onglet Programmes). */
export function PlanningToolbar({ view, onViewChange, onExport, onImport }: PlanningToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs value={view} onValueChange={(value) => onViewChange(value as PlanningViewMode)}>
        <TabsList>
          <TabsTrigger value="overview" aria-label="Vue calendrier">
            <CalendarRange className="size-4 sm:hidden" />
            <span className="hidden sm:inline">Calendrier</span>
          </TabsTrigger>
          <TabsTrigger value="week" aria-label="Vue semaine">
            <Rows3 className="size-4 sm:hidden" />
            <span className="hidden sm:inline">Semaine</span>
          </TabsTrigger>
          <TabsTrigger value="month" aria-label="Vue mois">
            <LayoutGrid className="size-4 sm:hidden" />
            <span className="hidden sm:inline">Mois</span>
          </TabsTrigger>
          <TabsTrigger value="list" aria-label="Vue liste">
            <ListIcon className="size-4 sm:hidden" />
            <span className="hidden sm:inline">Liste</span>
          </TabsTrigger>
          <TabsTrigger value="programs" aria-label="Programmes">
            <Users className="size-4 sm:hidden" />
            <span className="hidden sm:inline">Programmes</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {view !== "programs" && (
        <div className="flex items-center gap-2">
          {onImport && (
            <AppButton variant="outline" size="sm" onClick={onImport} aria-label="Importer des créneaux depuis un CSV">
              <Upload className="size-4" />
              Importer
            </AppButton>
          )}
          <AppButton variant="outline" size="sm" onClick={onExport} aria-label="Exporter la vue courante en CSV">
            <FileDown className="size-4" />
            Exporter
          </AppButton>
        </div>
      )}
    </div>
  );
}
