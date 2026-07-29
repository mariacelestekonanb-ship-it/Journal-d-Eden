"use client";

import * as React from "react";

export type NotificationViewMode = "list" | "table";

const STORAGE_KEY = "ejp-hub:notifications:view";
const DEFAULT_VIEW: NotificationViewMode = "list";

function isNotificationViewMode(value: string | null): value is NotificationViewMode {
  return value === "list" || value === "table";
}

/** Vue courante du centre de notifications (Liste groupée/Tableau), conservée entre les sessions. */
export function useNotificationsView() {
  const [view, setView] = React.useState<NotificationViewMode>(DEFAULT_VIEW);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isNotificationViewMode(stored)) {
      setView(stored);
    }
  }, []);

  const setPersistedView = React.useCallback((next: NotificationViewMode) => {
    setView(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [view, setPersistedView] as const;
}
