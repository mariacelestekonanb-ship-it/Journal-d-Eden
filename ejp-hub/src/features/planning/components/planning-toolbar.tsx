import { CalendarRange, FileDown, LayoutGrid, List as ListIcon, Rows3 } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import type { PlanningViewMode } from "../types/planning.types";

export interface PlanningToolbarProps {
  view: PlanningViewMode;
  onViewChange: (view: PlanningViewMode) => void;
  onExport: () => void;
}

/** Barre d'outils du Planning : bascule entre les 4 vues, export de la vue courante. */
export function PlanningToolbar({ view, onViewChange, onExport }: PlanningToolbarProps) {
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
        </TabsList>
      </Tabs>

      <AppButton variant="outline" size="sm" onClick={onExport} aria-label="Exporter la vue courante en CSV">
        <FileDown className="size-4" />
        Exporter
      </AppButton>
    </div>
  );
}
