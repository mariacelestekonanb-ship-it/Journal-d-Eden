import { createClient } from "@/shared/lib/supabase/client";
import type { TopicCategory, TopicPriority, TopicStatus } from "@/shared/types/database";

import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";

/**
 * Requêtes Supabase brutes du module Sujets de prière. Ce fichier est le
 * seul à connaître le schéma de la table `prayer_topics` — jamais appelé
 * depuis un composant (voir `services/prayer-topic-repository.ts`).
 */

export interface RawPrayerTopicAuthor {
  id: string;
  firstname: string;
  lastname: string;
}

export interface RawPrayerTopicRow {
  id: string;
  title: string;
  description: string | null;
  category: TopicCategory;
  priority: TopicPriority;
  status: TopicStatus;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  author: RawPrayerTopicAuthor | null;
}

const PRAYER_TOPIC_SELECT = `
  id, title, description, category, priority, status, start_date, end_date, created_at, updated_at, archived_at,
  author:profiles!prayer_topics_created_by_fkey(id, firstname, lastname)
`;

function toInsertPayload(values: PrayerTopicFormValues, authorId: string) {
  return {
    title: values.title,
    description: values.description || null,
    category: values.category,
    priority: values.priority,
    status: values.status,
    start_date: values.startDate,
    end_date: values.endDate || null,
    created_by: authorId,
  };
}

export async function queryAllPrayerTopics(): Promise<RawPrayerTopicRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_topics")
    .select(PRAYER_TOPIC_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawPrayerTopicRow[];
}

export async function createPrayerTopicQuery(
  values: PrayerTopicFormValues,
  authorId: string,
): Promise<RawPrayerTopicRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_topics")
    .insert(toInsertPayload(values, authorId))
    .select(PRAYER_TOPIC_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawPrayerTopicRow;
}

export async function updatePrayerTopicQuery(id: string, values: PrayerTopicFormValues): Promise<RawPrayerTopicRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_topics")
    .update({
      title: values.title,
      description: values.description || null,
      category: values.category,
      priority: values.priority,
      status: values.status,
      start_date: values.startDate,
      end_date: values.endDate || null,
    })
    .eq("id", id)
    .select(PRAYER_TOPIC_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawPrayerTopicRow;
}

export async function updatePrayerTopicStatusQuery(
  id: string,
  status: TopicStatus,
  archivedAt: string | null,
): Promise<RawPrayerTopicRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_topics")
    .update({ status, archived_at: archivedAt })
    .eq("id", id)
    .select(PRAYER_TOPIC_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawPrayerTopicRow;
}

export async function deletePrayerTopicQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("prayer_topics").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function queryActiveAuthors(): Promise<RawPrayerTopicAuthor[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, firstname, lastname")
    .eq("is_active", true)
    .order("firstname", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
