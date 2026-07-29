"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/features/auth/hooks/use-user";

import type { NotificationListContext } from "../repositories/notification-repository";
import { NotificationService } from "../services/notification.service";

export const NOTIFICATIONS_KEY = ["notifications", "list"] as const;

/** Contexte du visiteur courant, utilisé pour l'isolation stricte (voir `NotificationRepository`). */
export function useNotificationListContext(): NotificationListContext | null {
  const { profile } = useUser();
  if (!profile) return null;
  return { userId: profile.id, role: profile.role };
}

export function useNotifications() {
  const context = useNotificationListContext();

  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, context?.userId],
    queryFn: () => NotificationService.list(context as NotificationListContext),
    enabled: !!context,
    staleTime: 30 * 1000,
  });
}
