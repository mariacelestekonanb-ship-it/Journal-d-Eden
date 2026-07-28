import { FileText } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";

export function ReportsView() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Comptes rendus"
        description="Chaque conducteur rédige le compte rendu de ses propres créneaux de prière."
      />
      <AppEmptyState
        icon={FileText}
        title="Aucun compte rendu"
        description="Les comptes rendus liés à vos créneaux apparaîtront ici, avec export PDF et Word."
      />
    </div>
  );
}
