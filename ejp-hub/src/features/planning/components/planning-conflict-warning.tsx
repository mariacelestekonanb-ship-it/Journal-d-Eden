import { AlertTriangle } from "lucide-react";

import type { PlanningConflict } from "../types/planning.types";

export interface PlanningConflictWarningProps {
  conflicts: PlanningConflict[];
}

/** Liste des conflits détectés en direct pendant la saisie du formulaire. */
export function PlanningConflictWarning({ conflicts }: PlanningConflictWarningProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="space-y-1.5 rounded-lg border border-warning/40 bg-warning/10 p-3">
      {conflicts.map((conflict) => (
        <p key={conflict.type} className="flex items-start gap-2 text-xs text-warning-foreground">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {conflict.message}
        </p>
      ))}
    </div>
  );
}
