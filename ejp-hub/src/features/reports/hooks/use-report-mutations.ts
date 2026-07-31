"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { addCommentAction } from "../actions/add-comment.action";
import { createReportAction } from "../actions/create-report.action";
import { deleteReportAction } from "../actions/delete-report.action";
import { rejectReportAction } from "../actions/reject-report.action";
import { sendReportReminderAction } from "../actions/send-report-reminder.action";
import { submitReportAction } from "../actions/submit-report.action";
import { updateReportAction } from "../actions/update-report.action";
import { validateReportAction } from "../actions/validate-report.action";
import type { ReportParticipant } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";
import { REPORTS_KEY } from "./use-reports";

function useInvalidateReports() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
}

export function useCreateReport() {
  const invalidate = useInvalidateReports();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      values,
      slotId,
      leader,
      author,
    }: {
      values: ReportFormValues;
      slotId: string;
      leader: ReportParticipant;
      author: ReportParticipant;
    }) => createReportAction(values, slotId, leader, author),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["reports", "available-slots"] });
      toast.success("Brouillon créé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateReport() {
  const invalidate = useInvalidateReports();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ReportFormValues }) => updateReportAction(id, values),
    onSuccess: () => {
      invalidate();
      toast.success("Brouillon enregistré.");
    },
    onError: (error) => toast.error(error.message),
  });
}

/** Utilisée par l'autosave — pas de toast à chaque frappe, juste l'invalidation du cache. */
export function useSilentUpdateReport() {
  const invalidate = useInvalidateReports();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ReportFormValues }) => updateReportAction(id, values),
    onSuccess: () => invalidate(),
  });
}

export function useSubmitReport() {
  const invalidate = useInvalidateReports();
  return useMutation({
    mutationFn: (id: string) => submitReportAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Compte rendu soumis pour validation.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useValidateReport() {
  const invalidate = useInvalidateReports();
  return useMutation({
    mutationFn: (id: string) => validateReportAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Compte rendu validé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useRejectReport() {
  const invalidate = useInvalidateReports();
  return useMutation({
    mutationFn: (id: string) => rejectReportAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Compte rendu rejeté.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteReport() {
  const invalidate = useInvalidateReports();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReportAction(id),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["reports", "available-slots"] });
      toast.success("Compte rendu supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useSendReportReminder() {
  return useMutation({
    mutationFn: (input: { leaderId: string; slotTitle: string; slotDate: string }) => sendReportReminderAction(input),
    onSuccess: () => toast.success("Relance envoyée."),
    onError: (error) => toast.error(error.message),
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, author, message }: { reportId: string; author: ReportParticipant; message: string }) =>
      addCommentAction(reportId, author, message),
    onSuccess: (_comment, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ["reports", "comments", reportId] });
      toast.success("Commentaire ajouté.");
    },
    onError: (error) => toast.error(error.message),
  });
}
