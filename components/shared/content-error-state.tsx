import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export interface ContentErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  /** h3 par défaut ; passer h1 quand cet état remplace tout le contenu de la page (frontière d'erreur racine d'une route). */
  headingAs?: "h1" | "h2" | "h3";
}

/**
 * État d'erreur générique, prêt à l'emploi pour toute liste de contenu
 * (fiches, analyses de veille…) ou toute frontière d'erreur de page
 * (`error.tsx`). Non déclenché aujourd'hui par les données elles-mêmes :
 * les contenus de démonstration sont statiques et ne peuvent pas échouer à
 * charger — ce composant attend un vrai appel réseau (base de données, CMS
 * headless) susceptible d'échouer.
 */
export function ContentErrorState({
  title = "Impossible de charger le contenu",
  description = "Une erreur est survenue lors du chargement. Vérifiez votre connexion puis réessayez.",
  onRetry,
  headingAs,
}: ContentErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      headingAs={headingAs}
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
