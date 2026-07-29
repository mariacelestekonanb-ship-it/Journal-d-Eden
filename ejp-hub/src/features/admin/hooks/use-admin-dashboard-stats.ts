"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/features/auth";

import { AdminService } from "../services/admin.service";

export const ADMIN_DASHBOARD_STATS_KEY = ["admin", "dashboard-stats"] as const;

/** Les 7 indicateurs du tableau de bord — agrégés côté service, un seul cache ici. */
export function useAdminDashboardStats() {
  const { profile } = useUser();

  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_STATS_KEY, profile?.id],
    queryFn: () => AdminService.getDashboardStats(profile!.id),
    enabled: !!profile,
    staleTime: 30 * 1000,
  });
}
