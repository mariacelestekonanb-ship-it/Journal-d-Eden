"use client";

import { Section } from "@/components/ui/section";
import { ContentErrorState } from "@/components/shared/content-error-state";

/**
 * Frontière d'erreur de la page Ressources (obligatoirement un Client
 * Component, exigence Next.js). Réutilise `ContentErrorState`, partagé
 * avec les autres pages de contenu pour ce même scénario.
 */
export default function RessourcesError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <ContentErrorState
        title="Impossible de charger les ressources"
        onRetry={reset}
        headingAs="h1"
      />
    </Section>
  );
}
