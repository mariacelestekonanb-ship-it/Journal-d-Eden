import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export interface FicheErrorStateProps {
  onRetry?: () => void;
}

/**
 * État d'erreur prêt à l'emploi pour « Toutes les fiches ». Non déclenché
 * aujourd'hui : les données de démonstration sont statiques et ne peuvent
 * pas échouer à charger. Ce composant est prévu pour le jour où la liste
 * viendra d'un vrai appel réseau (`fetch`/base de données) susceptible
 * d'échouer.
 */
export function FicheErrorState({ onRetry }: FicheErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Impossible de charger les fiches"
      description="Une erreur est survenue lors du chargement. Vérifiez votre connexion puis réessayez."
      className="border-none bg-transparent"
      action={
        onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Réessayer
          </Button>
        ) : undefined
      }
    />
  );
}
