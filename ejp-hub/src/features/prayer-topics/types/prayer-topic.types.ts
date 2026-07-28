import type { Database } from "@/types/database";

export type PrayerTopic = Database["public"]["Tables"]["prayer_topics"]["Row"];
export type PrayerTopicInsert = Database["public"]["Tables"]["prayer_topics"]["Insert"];
export type PrayerTopicUpdate = Database["public"]["Tables"]["prayer_topics"]["Update"];
