"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCategoryAction } from "../actions/create-category.action";
import { deleteCategoryAction } from "../actions/delete-category.action";
import { updateCategoryAction } from "../actions/update-category.action";
import type { AdminCategoryFormValues } from "../validation/admin-category.schema";
import { ADMIN_CATEGORIES_KEY } from "./use-admin-categories";

function useInvalidateAdminCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
}

export function useCreateAdminCategory() {
  const invalidate = useInvalidateAdminCategories();
  return useMutation({
    mutationFn: (values: AdminCategoryFormValues) => createCategoryAction(values),
    onSuccess: () => {
      invalidate();
      toast.success("Catégorie créée.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateAdminCategory() {
  const invalidate = useInvalidateAdminCategories();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: AdminCategoryFormValues }) => updateCategoryAction(id, values),
    onSuccess: () => {
      invalidate();
      toast.success("Catégorie mise à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteAdminCategory() {
  const invalidate = useInvalidateAdminCategories();
  return useMutation({
    mutationFn: (id: string) => deleteCategoryAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Catégorie supprimée.");
    },
    onError: (error) => toast.error(error.message),
  });
}
