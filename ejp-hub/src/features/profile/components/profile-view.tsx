import { UserRound } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";

export function ProfileView() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Mon profil"
        description="Gérez vos informations personnelles et votre sécurité."
      />
      <AppEmptyState
        icon={UserRound}
        title="Cette section sera bientôt disponible"
        description="Vous pourrez y modifier votre nom, votre photo, votre téléphone et votre mot de passe."
      />
    </div>
  );
}
