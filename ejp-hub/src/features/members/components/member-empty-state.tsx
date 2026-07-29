import { Users } from "lucide-react";
import type { ReactNode } from "react";

import { AppEmptyState } from "@/shared/components/app-empty-state";

export interface MemberEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** État vide dédié aux Membres — même filtré, jamais une page blanche. */
export function MemberEmptyState({
  title = "Aucun membre",
  description = "Aucun membre ne correspond à cette recherche. Essayez d'élargir vos filtres.",
  action,
}: MemberEmptyStateProps) {
  return <AppEmptyState icon={Users} title={title} description={description} action={action} />;
}
