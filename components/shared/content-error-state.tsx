import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export interface ContentErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * État d'erreur générique, prêt à l'emploi pour toute liste de contenu
 * (fiches, analyses de veille…). Non déclenché aujourd'hui : les données de
 * démonstration sont statiques et ne peuvent pas échouer à charger — ce
 * composant attend un vrai appel réseau (base de données, CMS headless)
 * susceptible d'échouer.
 */
export function ContentErrorState({
  title = "Impossible de charger le contenu",
  description = "Une erreur est survenue lors du chargement. Vérifiez votre connexion puis réessayez.",
  onRetry,
}: ContentErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={description}
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
