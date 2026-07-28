"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelSlotAction } from "../actions/cancel-slot.action";
import { deleteSlotAction } from "../actions/delete-slot.action";
import { duplicateSlotAction } from "../actions/duplicate-slot.action";
import { createSlotAction } from "../actions/create-slot.action";
import { rescheduleSlotAction, updateSlotAction } from "../actions/update-slot.action";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";
import { PLANNING_SLOTS_KEY } from "./use-planning-slots";

function useInvalidatePlanningSlots() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PLANNING_SLOTS_KEY });
}

export function useCreateSlot() {
  const invalidate = useInvalidatePlanningSlots();
  return useMutation({
    mutationFn: (values: PlanningSlotFormValues) => createSlotAction(values),
    onSuccess: () => {
      invalidate();
      toast.success("Créneau créé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateSlot() {
  const invalidate = useInvalidatePlanningSlots();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PlanningSlotFormValues }) => updateSlotAction(id, values),
    onSuccess: () => {
      invalidate();
      toast.success("Créneau mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

/** Utilisée par le glisser-déposer / redimensionnement du calendrier — pas de toast de succès (feedback visuel déjà immédiat). */
export function useRescheduleSlot() {
  const invalidate = useInvalidatePlanningSlots();
  return useMutation({
    mutationFn: ({ id, schedule }: { id: string; schedule: { date: string; startTime: string; endTime: string } }) =>
      rescheduleSlotAction(id, schedule),
    onSuccess: () => invalidate(),
    onError: (error) => toast.error(error.message),
  });
}

export function useCancelSlot() {
  const invalidate = useInvalidatePlanningSlots();
  return useMutation({
    mutationFn: (id: string) => cancelSlotAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Créneau annulé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteSlot() {
  const invalidate = useInvalidatePlanningSlots();
  return useMutation({
    mutationFn: (id: string) => deleteSlotAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Créneau supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDuplicateSlot() {
  const invalidate = useInvalidatePlanningSlots();
  return useMutation({
    mutationFn: (id: string) => duplicateSlotAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Créneau dupliqué.");
    },
    onError: (error) => toast.error(error.message),
  });
}
