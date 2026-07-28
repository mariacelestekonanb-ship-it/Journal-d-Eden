"use client";

import * as React from "react";

import type { PrayerTopicViewMode } from "../types/prayer-topic.types";

const STORAGE_KEY = "ejp-hub:prayer-topics:view";
const DEFAULT_VIEW: PrayerTopicViewMode = "cards";

function isPrayerTopicViewMode(value: string | null): value is PrayerTopicViewMode {
  return value === "list" || value === "cards";
}

/** Vue courante des Sujets de prière (Liste/Cartes), conservée entre les sessions. */
export function usePrayerTopicsView() {
  const [view, setView] = React.useState<PrayerTopicViewMode>(DEFAULT_VIEW);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isPrayerTopicViewMode(stored)) {
      setView(stored);
    }
  }, []);

  const setPersistedView = React.useCallback((next: PrayerTopicViewMode) => {
    setView(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [view, setPersistedView] as const;
}
