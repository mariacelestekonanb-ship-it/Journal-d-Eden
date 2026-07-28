"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createTestimony, deleteTestimony, listTestimonies } from "../services/testimonies.service";
import type { TestimonyFormValues } from "../validation/testimony.schema";

const TESTIMONIES_KEY = ["testimonies"] as const;

export function useTestimonies() {
  return useQuery({
    queryKey: TESTIMONIES_KEY,
    queryFn: listTestimonies,
  });
}

export function useCreateTestimony(authorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TestimonyFormValues) => createTestimony(values, authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIES_KEY });
      toast.success("Témoignage publié.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteTestimony() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimony,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIES_KEY });
      toast.success("Témoignage supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}
