import { Church, Globe, GraduationCap, HeartPulse, Megaphone, User, Users, type LucideIcon } from "lucide-react";

import type { PrayerTopicCategory } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_CATEGORY_VALUES } from "../validation/prayer-topic.schema";

export interface PrayerTopicCategoryConfig {
  label: string;
  icon: LucideIcon;
  description: string;
}

/**
 * Source unique des catégories — libellé, icône et description. Ajouter une
 * catégorie se résume à l'ajouter ici, à l'enum Postgres `prayer_topic_category`
 * (migration) et à `PRAYER_TOPIC_CATEGORY_VALUES` (schéma Zod).
 */
export const PRAYER_TOPIC_CATEGORY_CONFIG: Record<PrayerTopicCategory, PrayerTopicCategoryConfig> = {
  CHURCH: { label: "Église", icon: Church, description: "Vie de l'assemblée, unité, direction spirituelle." },
  FAMILY: { label: "Famille", icon: Users, description: "Couples, enfants, relations familiales." },
  YOUTH: { label: "Jeunesse", icon: GraduationCap, description: "Adolescents et jeunes adultes." },
  EVANGELISM: { label: "Évangélisation", icon: Megaphone, description: "Annonce de la foi, missions locales." },
  HEALING: { label: "Guérison", icon: HeartPulse, description: "Santé physique et intérieure." },
  NATIONS: { label: "Nations", icon: Globe, description: "Paix, gouvernance, missions à l'étranger." },
  PERSONAL: { label: "Personnel", icon: User, description: "Besoins individuels et discrétion pastorale." },
};

export const PRAYER_TOPIC_CATEGORY_OPTIONS = PRAYER_TOPIC_CATEGORY_VALUES;
