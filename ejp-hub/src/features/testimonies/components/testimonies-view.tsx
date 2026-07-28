import { Sparkles } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";

export function TestimoniesView() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Témoignages"
        description="Partagez ce que Dieu fait à travers les temps de prière de la communauté."
      />
      <AppEmptyState
        icon={Sparkles}
        title="Aucun témoignage"
        description="Les témoignages partagés par les conducteurs de prière apparaîtront ici."
      />
    </div>
  );
}
