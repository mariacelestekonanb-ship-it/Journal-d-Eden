import { MapPin } from "lucide-react";
import * as React from "react";

import type { PrayerSlot } from "../types/planning.types";

export interface PlanningEventProps {
  slot: PrayerSlot;
  timeText: string;
  /** Vue mois : rendu très compact (une ligne). Vue semaine : plus de détail. */
  compact?: boolean;
}

/**
 * Contenu personnalisé d'un événement du calendrier (`PlanningCalendar`).
 * Composant pur, sans dépendance à FullCalendar — facilement testable et
 * réutilisable si un futur module affiche des créneaux hors calendrier.
 */
function PlanningEventComponent({ slot, timeText, compact }: PlanningEventProps) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 overflow-hidden px-1 py-0.5 text-xs">
      <div className="flex min-w-0 items-center gap-1 font-medium">
        {timeText && <span className="shrink-0 tabular-nums">{timeText}</span>}
        <span className="truncate">{slot.title}</span>
      </div>
      {!compact && (
        <div className="flex min-w-0 items-center gap-2 opacity-90">
          <span className="truncate">{slot.primaryLeader?.fullName ?? "Non assigné"}</span>
          {slot.location && (
            <span className="flex shrink-0 items-center gap-0.5">
              <MapPin className="size-3" aria-hidden="true" />
              <span className="truncate">{slot.location}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export const PlanningEvent = React.memo(PlanningEventComponent);
