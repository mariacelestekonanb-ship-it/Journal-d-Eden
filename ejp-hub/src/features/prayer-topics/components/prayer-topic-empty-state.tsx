import { HeartHandshake } from "lucide-react";
import type { ReactNode } from "react";

import { AppEmptyState } from "@/shared/components/app-empty-state";

export interface PrayerTopicEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** État vide dédié aux Sujets de prière — même filtré, jamais une page blanche. */
export function PrayerTopicEmptyState({
  title = "Aucun sujet de prière",
  description = "Aucun sujet ne correspond à cette recherche. Essayez d'élargir vos filtres.",
  action,
}: PrayerTopicEmptyStateProps) {
  return <AppEmptyState icon={HeartHandshake} title={title} description={description} action={action} />;
}
