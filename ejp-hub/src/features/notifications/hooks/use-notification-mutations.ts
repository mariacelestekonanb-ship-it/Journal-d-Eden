"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createNotificationAction } from "../actions/create-notification.action";
import { deleteNotificationAction } from "../actions/delete-notification.action";
import { markAllNotificationsReadAction } from "../actions/mark-all-notifications-read.action";
import { markNotificationReadAction } from "../actions/mark-notification-read.action";
import type { NotificationListContext } from "../repositories/notification-repository";
import type { CreateNotificationInput } from "../validation/create-notification.schema";
import { NOTIFICATIONS_KEY } from "./use-notifications";

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
}

/** Silencieux (pas de toast) : cliquer une notification pour la lire ne doit pas interrompre la lecture. */
export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: ({ id, context }: { id: string; context: NotificationListContext }) => markNotificationReadAction(id, context),
    onSuccess: () => invalidate(),
  });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (context: NotificationListContext) => markAllNotificationsReadAction(context),
    onSuccess: () => {
      invalidate();
      toast.success("Toutes les notifications ont été marquées comme lues.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: ({ id, context }: { id: string; context: NotificationListContext }) => deleteNotificationAction(id, context),
    onSuccess: () => {
      invalidate();
      toast.success("Notification supprimée.");
    },
    onError: (error) => toast.error(error.message),
  });
}

/** Utilisée par les futurs appelants inter-modules (voir NOTIFICATIONS.md) et par les tests manuels du centre de notifications. */
export function useCreateNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (input: CreateNotificationInput) => createNotificationAction(input),
    onSuccess: () => invalidate(),
    onError: (error) => toast.error(error.message),
  });
}
