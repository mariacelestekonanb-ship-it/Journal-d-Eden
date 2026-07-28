"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createSlot,
  deleteSlot,
  listActiveConducteurs,
  listSlotsInRange,
  updateSlot,
} from "../services/planning.service";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

export function slotsQueryKey(startDate: string, endDate: string) {
  return ["planning-slots", startDate, endDate] as const;
}

export function useSlotsInRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: slotsQueryKey(startDate, endDate),
    queryFn: () => listSlotsInRange(startDate, endDate),
  });
}

export function useActiveConducteurs() {
  return useQuery({
    queryKey: ["active-conducteurs"],
    queryFn: listActiveConducteurs,
  });
}

export function useCreateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planning-slots"] });
      toast.success("Créneau créé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PlanningSlotFormValues }) => updateSlot(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planning-slots"] });
      toast.success("Créneau mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planning-slots"] });
      toast.success("Créneau supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}
