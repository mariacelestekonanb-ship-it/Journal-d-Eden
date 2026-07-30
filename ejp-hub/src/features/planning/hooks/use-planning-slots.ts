"use client";

import { useQuery } from "@tanstack/react-query";

import { PlanningService } from "../services/planning.service";

export const PLANNING_SLOTS_KEY = ["planning", "slots"] as const;

export function usePlanningSlots() {
  return useQuery({
    queryKey: PLANNING_SLOTS_KEY,
    queryFn: () => PlanningService.list(),
  });
}

export function usePlanningLeaderOptions() {
  return useQuery({
    queryKey: ["planning", "leader-options"],
    queryFn: () => PlanningService.listLeaderOptions(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlanningPrayerTopicOptions() {
  return useQuery({
    queryKey: ["planning", "prayer-topic-options"],
    queryFn: () => PlanningService.listPrayerTopicOptions(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlanningProgramOptions() {
  return useQuery({
    queryKey: ["planning", "program-options"],
    queryFn: () => PlanningService.listProgramOptions(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlanningLocationOptions() {
  return useQuery({
    queryKey: ["planning", "location-options"],
    queryFn: () => PlanningService.listLocationOptions(),
    staleTime: 5 * 60 * 1000,
  });
}
