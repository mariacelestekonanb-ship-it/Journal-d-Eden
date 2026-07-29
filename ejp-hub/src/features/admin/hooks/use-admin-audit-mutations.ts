"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { recordAuditLogEntryAction } from "../actions/record-audit-log-entry.action";
import type { RecordAuditLogEntryInput } from "../repositories/admin-repository";
import { ADMIN_AUDIT_LOG_KEY } from "./use-admin-audit-log";

/**
 * Prête pour les futurs appelants inter-modules (voir ADMIN.md) — même
 * statut que `useCreateNotification` côté Notifications : le service et
 * l'action existent, aucun composant ne déclenche encore cette mutation.
 */
export function useRecordAuditLogEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecordAuditLogEntryInput) => recordAuditLogEntryAction(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_AUDIT_LOG_KEY }),
  });
}
