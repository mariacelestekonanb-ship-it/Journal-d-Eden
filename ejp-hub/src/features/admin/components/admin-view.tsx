import { Settings2 } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";

export function AdminView() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Administration"
        description="Gérez les comptes des conducteurs de prière et leurs rôles."
      />
      <AppEmptyState
        icon={Settings2}
        title="Cette section sera bientôt disponible"
        description="Vous pourrez y inviter des conducteurs, gérer les rôles et activer ou désactiver des comptes."
      />
    </div>
  );
}
