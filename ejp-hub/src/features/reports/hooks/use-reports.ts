"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/features/auth";

import type { ReportListContext } from "../repositories/report-repository";
import { ReportService } from "../services/report.service";

export const REPORTS_KEY = ["reports", "list"] as const;

/** Contexte du visiteur courant, utilisé pour l'isolation par rôle (voir `ReportRepository`). */
export function useReportListContext(): ReportListContext | null {
  const { profile } = useUser();
  if (!profile) return null;
  return { userId: profile.id, role: profile.role };
}

export function useReports() {
  const context = useReportListContext();

  return useQuery({
    queryKey: [...REPORTS_KEY, context?.userId, context?.role],
    queryFn: () => ReportService.list(context as ReportListContext),
    enabled: !!context,
  });
}

export function useAvailableSlots() {
  const { profile } = useUser();
  return useQuery({
    queryKey: ["reports", "available-slots", profile?.id],
    queryFn: () => ReportService.listAvailableSlots(profile!.id),
    enabled: !!profile,
    staleTime: 60 * 1000,
  });
}

/** Créneaux en attente de compte rendu, tous conducteurs confondus — réservé à l'admin. */
export function usePendingReportSlots(enabled: boolean) {
  return useQuery({
    queryKey: ["reports", "pending-slots"],
    queryFn: () => ReportService.listPendingReportSlots(),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useReportComments(reportId: string | undefined) {
  return useQuery({
    queryKey: ["reports", "comments", reportId],
    queryFn: () => ReportService.listComments(reportId as string),
    enabled: !!reportId,
  });
}
