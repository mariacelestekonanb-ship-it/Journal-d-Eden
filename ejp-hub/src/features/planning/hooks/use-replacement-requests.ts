"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelReplacementRequestAction } from "../actions/cancel-replacement-request.action";
import { decideReplacementRequestAction } from "../actions/decide-replacement-request.action";
import { requestReplacementAction } from "../actions/request-replacement.action";
import { ReplacementRequestService } from "../services/replacement-request.service";
import type { PlanningLeaderRole } from "../types/planning.types";
import { PLANNING_SLOTS_KEY } from "./use-planning-slots";

function replacementRequestsKey(planningId: string) {
  return ["planning", "replacement-requests", planningId] as const;
}

/** Demandes de remplacement d'un créneau donné — affichées dans son détail. */
export function useReplacementRequests(planningId: string | undefined) {
  return useQuery({
    queryKey: replacementRequestsKey(planningId ?? ""),
    queryFn: () => ReplacementRequestService.listForSlot(planningId!),
    enabled: !!planningId,
  });
}

export function useCreateReplacementRequest(planningId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { role: PlanningLeaderRole; requestedBy: string; proposedMemberId: string; comment: string | null }) =>
      requestReplacementAction({ planningId, ...input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: replacementRequestsKey(planningId) });
      toast.success("Demande de remplacement envoyée.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDecideReplacementRequest(planningId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision, decidedBy }: { id: string; decision: "APPROVED" | "REJECTED"; decidedBy: string }) =>
      decideReplacementRequestAction(id, decision, decidedBy),
    onSuccess: (_, { decision }) => {
      queryClient.invalidateQueries({ queryKey: replacementRequestsKey(planningId) });
      queryClient.invalidateQueries({ queryKey: PLANNING_SLOTS_KEY });
      toast.success(decision === "APPROVED" ? "Remplacement approuvé." : "Demande refusée.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCancelReplacementRequest(planningId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelReplacementRequestAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: replacementRequestsKey(planningId) });
      toast.success("Demande annulée.");
    },
    onError: (error) => toast.error(error.message),
  });
}
