"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getActiveTopicsCount,
  getPendingReportsCount,
  getRecentTestimonies,
  getUpcomingSlots,
} from "../services/dashboard.service";

export function useUpcomingSlots(userId: string, isAdmin: boolean) {
  return useQuery({
    queryKey: ["dashboard", "upcoming-slots", userId, isAdmin],
    queryFn: () => getUpcomingSlots(userId, isAdmin),
  });
}

export function useActiveTopicsCount() {
  return useQuery({
    queryKey: ["dashboard", "active-topics-count"],
    queryFn: getActiveTopicsCount,
  });
}

export function usePendingReportsCount(userId: string, isAdmin: boolean) {
  return useQuery({
    queryKey: ["dashboard", "pending-reports-count", userId, isAdmin],
    queryFn: () => getPendingReportsCount(userId, isAdmin),
  });
}

export function useRecentTestimonies() {
  return useQuery({
    queryKey: ["dashboard", "recent-testimonies"],
    queryFn: getRecentTestimonies,
  });
}
