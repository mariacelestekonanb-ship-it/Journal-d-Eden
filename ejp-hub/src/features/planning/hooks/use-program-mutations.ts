"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProgramAction } from "../actions/create-program.action";
import { deleteProgramAction } from "../actions/delete-program.action";
import { updateProgramAction } from "../actions/update-program.action";
import type { ProgramFormValues } from "../validation/program.schema";
import { PLANNING_SLOTS_KEY } from "./use-planning-slots";
import { PROGRAMS_KEY } from "./use-programs";

/** Un programme touche aussi les créneaux qui l'affichent (nom, description) — les deux caches sont invalidés ensemble. */
function useInvalidatePrograms() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: PROGRAMS_KEY });
    queryClient.invalidateQueries({ queryKey: ["planning", "program-options"] });
    queryClient.invalidateQueries({ queryKey: PLANNING_SLOTS_KEY });
  };
}

export function useCreateProgram() {
  const invalidate = useInvalidatePrograms();
  return useMutation({
    mutationFn: (values: ProgramFormValues) => createProgramAction(values),
    onSuccess: () => {
      invalidate();
      toast.success("Programme créé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateProgram() {
  const invalidate = useInvalidatePrograms();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProgramFormValues }) => updateProgramAction(id, values),
    onSuccess: () => {
      invalidate();
      toast.success("Programme mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteProgram() {
  const invalidate = useInvalidatePrograms();
  return useMutation({
    mutationFn: (id: string) => deleteProgramAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Programme supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}
