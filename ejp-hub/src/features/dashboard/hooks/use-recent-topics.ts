"use client";

import { useQuery } from "@tanstack/react-query";

import { DashboardService } from "../services/dashboard.service";

export function useRecentTopics() {
  return useQuery({
    queryKey: ["dashboard", "recent-topics"],
    queryFn: () => DashboardService.getRecentPrayerTopics(),
  });
}
