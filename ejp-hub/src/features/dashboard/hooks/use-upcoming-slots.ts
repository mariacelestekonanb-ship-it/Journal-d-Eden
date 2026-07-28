"use client";

import { useQuery } from "@tanstack/react-query";

import type { Role } from "@/shared/constants/roles";

import { DashboardService } from "../services/dashboard.service";

export function useUpcomingSlots(role: Role, userId: string) {
  return useQuery({
    queryKey: ["dashboard", "upcoming-slots", role, userId],
    queryFn: () => DashboardService.getUpcomingSlots({ role, userId }),
  });
}
