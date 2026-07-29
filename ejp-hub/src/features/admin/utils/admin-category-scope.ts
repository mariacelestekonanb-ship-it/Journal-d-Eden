import type { AdminCategoryScope } from "../types/admin.types";

export const ADMIN_CATEGORY_SCOPE_OPTIONS: AdminCategoryScope[] = ["PRAYER_TOPIC_CATEGORY", "MEETING_TYPE"];

export const ADMIN_CATEGORY_SCOPE_LABELS: Record<AdminCategoryScope, string> = {
  PRAYER_TOPIC_CATEGORY: "Catégorie de sujet de prière",
  MEETING_TYPE: "Type de réunion",
};
