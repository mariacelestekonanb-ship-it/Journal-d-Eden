import { createClient } from "@/lib/supabase/client";

import type { PrayerTopic, PrayerTopicUpdate } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";

export async function listPrayerTopics(): Promise<PrayerTopic[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_topics")
    .select("*")
    .order("status", { ascending: true })
    .order("priority", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createPrayerTopic(values: PrayerTopicFormValues, createdBy: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("prayer_topics").insert({
    title: values.title,
    description: values.description || null,
    priority: values.priority,
    start_date: values.start_date,
    end_date: values.end_date || null,
    created_by: createdBy,
  });

  if (error) throw new Error(error.message);
}

export async function updatePrayerTopic(id: string, values: PrayerTopicFormValues): Promise<void> {
  const supabase = createClient();
  const payload: PrayerTopicUpdate = {
    title: values.title,
    description: values.description || null,
    priority: values.priority,
    start_date: values.start_date,
    end_date: values.end_date || null,
  };
  const { error } = await supabase.from("prayer_topics").update(payload).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function archivePrayerTopic(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("prayer_topics").update({ status: "archive" }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restorePrayerTopic(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("prayer_topics").update({ status: "actif" }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deletePrayerTopic(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("prayer_topics").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
