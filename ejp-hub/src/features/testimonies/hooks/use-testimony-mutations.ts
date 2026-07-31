"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createTestimonyAction } from "../actions/create-testimony.action";
import { deleteTestimonyAction } from "../actions/delete-testimony.action";
import type { TestimonyFormValues } from "../validation/testimony.schema";
import { TESTIMONIES_KEY } from "./use-testimonies";

function useInvalidateTestimonies() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: TESTIMONIES_KEY });
}

export function useCreateTestimony() {
  const invalidate = useInvalidateTestimonies();
  return useMutation({
    mutationFn: ({ values, authorId, authorName }: { values: TestimonyFormValues; authorId: string; authorName: string }) =>
      createTestimonyAction(values, authorId, authorName),
    onSuccess: () => {
      invalidate();
      toast.success("Témoignage publié.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteTestimony() {
  const invalidate = useInvalidateTestimonies();
  return useMutation({
    mutationFn: (id: string) => deleteTestimonyAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Témoignage supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}
