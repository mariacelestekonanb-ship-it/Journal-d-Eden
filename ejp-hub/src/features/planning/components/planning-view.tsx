import { CalendarDays } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";

export function PlanningView() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Planning"
        description="Organisez les créneaux de prière et suivez les assignations des conducteurs."
      />
      <AppEmptyState
        icon={CalendarDays}
        title="Aucun créneau planifié"
        description="Les vues semaine et mois, l'import Excel et les exports apparaîtront ici dans un prochain sprint."
      />
    </div>
  );
}
