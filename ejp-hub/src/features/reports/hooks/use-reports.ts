"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createReport, deleteReport, listPendingSlots, listReports, updateReport } from "../services/reports.service";
import type { ReportFormValues } from "../validation/report.schema";

export function useReports(scope: "own" | "all", userId: string) {
  return useQuery({
    queryKey: ["reports", scope, userId],
    queryFn: () => listReports(scope, userId),
  });
}

export function usePendingSlots(userId: string) {
  return useQuery({
    queryKey: ["reports-pending-slots", userId],
    queryFn: () => listPendingSlots(userId),
  });
}

export function useCreateReport(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, values }: { slotId: string; values: ReportFormValues }) =>
      createReport(slotId, userId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-pending-slots"] });
      toast.success("Compte rendu enregistré.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ReportFormValues }) => updateReport(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Compte rendu mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Compte rendu supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}
