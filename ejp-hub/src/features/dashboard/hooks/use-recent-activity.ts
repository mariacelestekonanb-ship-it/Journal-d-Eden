"use client";

import { useQuery } from "@tanstack/react-query";

import { DashboardService } from "../services/dashboard.service";

export function useRecentActivity() {
  return useQuery({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: () => DashboardService.getRecentActivity(),
  });
}
