"use client";

import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

/**
 * Frontière d'erreur de l'espace d'administration (obligatoirement un
 * Client Component, exigence Next.js). Distincte de `app/error.tsx` (site
 * public) pour rester visuellement cohérente avec `AdminShell` plutôt que
 * de retomber sur l'identité graphique du site public.
 */
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      headingAs="h1"
      title="Une erreur est survenue"
      description="Le chargement de cette page a échoué. Réessayez, ou revenez au tableau de bord."
      action={
        <Button variant="accent" onClick={reset}>
          Réessayer
        </Button>
      }
    />
  );
}
