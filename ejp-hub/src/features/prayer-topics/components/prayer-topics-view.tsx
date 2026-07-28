import { HeartHandshake } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";

export function PrayerTopicsView() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Sujets de prière"
        description="Suivez les sujets portés par la communauté, avec priorité et archivage automatique."
      />
      <AppEmptyState
        icon={HeartHandshake}
        title="Aucun sujet de prière"
        description="Les sujets créés par les administrateurs apparaîtront ici, classés par priorité."
      />
    </div>
  );
}
