import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

import { AppEmptyState } from "@/shared/components/app-empty-state";

export interface AdminEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** État vide générique du module Administration — réutilisé par les 4 pages de gestion. */
export function AdminEmptyState({
  title = "Rien à afficher",
  description = "Aucune donnée ne correspond à ces critères pour le moment.",
  action,
}: AdminEmptyStateProps) {
  return <AppEmptyState icon={ShieldAlert} title={title} description={description} action={action} />;
}
