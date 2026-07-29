"use client";

import * as React from "react";

import type { ReportFormValues } from "../validation/report.schema";
import { useSilentUpdateReport } from "./use-report-mutations";

const AUTOSAVE_DELAY_MS = 2000;

export type ReportAutosaveStatus = "idle" | "saving" | "saved";

/**
 * Sauvegarde automatique d'un brouillon (ou d'un CR rejeté en cours de
 * correction) — débounce 2 s après la dernière frappe, silencieuse (pas de
 * toast à chaque sauvegarde, voir `useSilentUpdateReport`). N'agit que si
 * `reportId` est défini : la toute première création reste une action
 * explicite de l'utilisateur (choix du créneau).
 */
export function useReportAutosave(
  reportId: string | undefined,
  values: ReportFormValues,
  enabled: boolean,
): ReportAutosaveStatus {
  const { mutate } = useSilentUpdateReport();
  const [status, setStatus] = React.useState<ReportAutosaveStatus>("idle");
  const previousSerializedRef = React.useRef<string>(JSON.stringify(values));
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!enabled || !reportId) return;

    const serialized = JSON.stringify(values);
    if (serialized === previousSerializedRef.current) return;
    previousSerializedRef.current = serialized;

    setStatus("idle");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setStatus("saving");
      mutate(
        { id: reportId, values },
        {
          onSuccess: () => setStatus("saved"),
          onError: () => setStatus("idle"),
        },
      );
    }, AUTOSAVE_DELAY_MS);
  }, [values, enabled, reportId, mutate]);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return status;
}
