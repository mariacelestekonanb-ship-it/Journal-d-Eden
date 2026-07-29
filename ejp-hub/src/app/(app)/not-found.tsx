import { SearchXIcon } from "lucide-react";
import Link from "next/link";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { ROUTES } from "@/shared/constants/app";
import { Button } from "@/shared/ui/button";

/** 404 affiché à l'intérieur du shell (sidebar/header) pour un lien cassé en cours de navigation. */
export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <AppEmptyState
        icon={SearchXIcon}
        title="Page introuvable"
        description="Cette page n'existe pas ou a été déplacée. Vérifiez l'adresse ou revenez au tableau de bord."
        action={
          <Button asChild variant="outline">
            <Link href={ROUTES.dashboard}>Retour au tableau de bord</Link>
          </Button>
        }
      />
    </div>
  );
}
