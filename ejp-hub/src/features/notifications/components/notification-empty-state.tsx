import { Bell } from "lucide-react";
import type { ReactNode } from "react";

import { AppEmptyState } from "@/shared/components/app-empty-state";

export interface NotificationEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** État vide dédié aux Notifications — même filtré, jamais une page blanche. */
export function NotificationEmptyState({
  title = "Aucune notification",
  description = "Vous êtes à jour ! Aucune notification ne correspond à cette recherche.",
  action,
}: NotificationEmptyStateProps) {
  return <AppEmptyState icon={Bell} title={title} description={description} action={action} />;
}
