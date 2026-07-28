import { LayoutDashboard } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";

export function DashboardView() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité de prière de l'EJP."
      />
      <AppEmptyState
        icon={LayoutDashboard}
        title="Aucune donnée pour le moment"
        description="Le tableau de bord affichera bientôt les prochains créneaux, les sujets actifs et les comptes rendus en attente."
      />
    </div>
  );
}
