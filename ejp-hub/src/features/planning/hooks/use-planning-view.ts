"use client";

import * as React from "react";

import type { PlanningViewMode } from "../types/planning.types";

const STORAGE_KEY = "ejp-hub:planning:view";
const DEFAULT_VIEW: PlanningViewMode = "month";

function isPlanningViewMode(value: string | null): value is PlanningViewMode {
  return value === "overview" || value === "week" || value === "month" || value === "list";
}

/** Vue courante du Planning (Calendrier/Semaine/Mois/Liste), conservée entre les sessions. */
export function usePlanningView() {
  const [view, setView] = React.useState<PlanningViewMode>(DEFAULT_VIEW);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isPlanningViewMode(stored)) {
      setView(stored);
    }
  }, []);

  const setPersistedView = React.useCallback((next: PlanningViewMode) => {
    setView(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [view, setPersistedView] as const;
}
