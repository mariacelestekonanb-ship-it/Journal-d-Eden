"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminService } from "../services/admin.service";

export const ADMIN_CATEGORIES_KEY = ["admin", "categories"] as const;

export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: () => AdminService.listCategories(),
  });
}
