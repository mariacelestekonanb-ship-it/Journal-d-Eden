import { createClient } from "@/shared/lib/supabase/client";
import type { NotificationPriority, NotificationType } from "@/shared/types/database";

import type { CreateNotificationInput } from "../validation/create-notification.schema";

/**
 * Requêtes Supabase brutes du module Notifications. Ce fichier est le seul
 * à connaître le schéma de la table `notifications` — jamais appelé depuis
 * un composant (voir `repositories/notification-repository.ts`).
 */

export interface RawNotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url: string | null;
  read_at: string | null;
  created_at: string;
}

const NOTIFICATION_SELECT = "id, user_id, type, priority, title, message, action_url, read_at, created_at";

export async function queryAllNotifications(userId: string): Promise<RawNotificationRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select(NOTIFICATION_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawNotificationRow[];
}

/**
 * `userId` est filtré ici en plus de la RLS — défense en profondeur,
 * cohérente avec `MockNotificationRepository` qui vérifie la même chose :
 * une notification ne se marque jamais lue ni ne se supprime en dehors de
 * son propriétaire, même si une régression RLS venait à l'autoriser.
 */
export async function markNotificationReadQuery(id: string, userId: string): Promise<RawNotificationRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select(NOTIFICATION_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawNotificationRow;
}

export async function markAllNotificationsReadQuery(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw new Error(error.message);
}

export async function deleteNotificationQuery(id: string, userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function createNotificationQuery(input: CreateNotificationInput): Promise<RawNotificationRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.userId,
      type: input.type,
      priority: input.priority ?? "NORMAL",
      title: input.title,
      message: input.message,
      action_url: input.actionUrl ?? null,
    })
    .select(NOTIFICATION_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawNotificationRow;
}
