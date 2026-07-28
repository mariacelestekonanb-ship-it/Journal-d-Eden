"use client";

import { useQuery } from "@tanstack/react-query";

import type { Role } from "@/shared/constants/roles";

import { DashboardService } from "../services/dashboard.service";

export function useDashboardStats(role: Role, userId: string) {
  return useQuery({
    queryKey: ["dashboard", "stats", role, userId],
    queryFn: () => DashboardService.getStats({ role, userId }),
  });
}
