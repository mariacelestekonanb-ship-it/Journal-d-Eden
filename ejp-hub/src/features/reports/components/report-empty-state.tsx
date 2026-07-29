import { FileText } from "lucide-react";
import type { ReactNode } from "react";

import { AppEmptyState } from "@/shared/components/app-empty-state";

export interface ReportEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** État vide dédié aux Comptes rendus — même filtré, jamais une page blanche. */
export function ReportEmptyState({
  title = "Aucun compte rendu",
  description = "Aucun compte rendu ne correspond à cette recherche. Essayez d'élargir vos filtres.",
  action,
}: ReportEmptyStateProps) {
  return <AppEmptyState icon={FileText} title={title} description={description} action={action} />;
}
