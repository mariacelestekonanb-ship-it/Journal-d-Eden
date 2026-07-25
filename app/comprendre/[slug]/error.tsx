"use client";

import { Section } from "@/components/ui/section";
import { ContentErrorState } from "@/components/shared/content-error-state";

/**
 * Frontière d'erreur de la fiche (obligatoirement un Client Component,
 * exigence Next.js). Réutilise `ContentErrorState`, partagé avec la page
 * Comprendre pour ce même scénario.
 */
export default function FicheError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <ContentErrorState
        title="Impossible de charger cette fiche"
        onRetry={reset}
      />
    </Section>
  );
}
