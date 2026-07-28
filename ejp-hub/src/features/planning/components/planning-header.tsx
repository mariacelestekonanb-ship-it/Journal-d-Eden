import { Plus } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { AppPageHeader } from "@/shared/components/app-page-header";

import type { PlanningPermissions } from "../utils/planning-permissions";

export interface PlanningHeaderProps {
  permissions: PlanningPermissions;
  onCreateClick: () => void;
}

/** En-tête de la page Planning : titre, description, et création de créneau si autorisée. */
export function PlanningHeader({ permissions, onCreateClick }: PlanningHeaderProps) {
  return (
    <AppPageHeader
      title="Planning"
      description="Le moteur de planification d'EJP Hub : organisez les créneaux de prière et leurs conducteurs."
      actions={
        permissions.canCreate ? (
          <AppButton onClick={onCreateClick}>
            <Plus className="size-4" />
            Nouveau créneau
          </AppButton>
        ) : undefined
      }
    />
  );
}
