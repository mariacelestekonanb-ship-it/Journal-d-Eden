"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DashboardService } from "../services/dashboard.service";

function notificationsKey(userId: string) {
  return ["dashboard", "notifications", userId] as const;
}

export function useDashboardNotifications(userId: string) {
  return useQuery({
    queryKey: notificationsKey(userId),
    queryFn: () => DashboardService.getNotifications(userId),
  });
}

export function useMarkNotificationAsRead(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DashboardService.markNotificationAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsKey(userId) }),
  });
}

export function useMarkAllNotificationsAsRead(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => DashboardService.markAllNotificationsAsRead(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsKey(userId) }),
  });
}
