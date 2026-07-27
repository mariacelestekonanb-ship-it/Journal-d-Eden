"use client";

import { Section } from "@/components/ui/section";
import { ContentErrorState } from "@/components/shared/content-error-state";

/**
 * Frontière d'erreur de l'analyse (obligatoirement un Client Component,
 * exigence Next.js). Réutilise `ContentErrorState`, partagé avec la fiche
 * pédagogique pour ce même scénario.
 */
export default function AnalyseError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <ContentErrorState
        title="Impossible de charger cette analyse"
        onRetry={reset}
        headingAs="h1"
      />
    </Section>
  );
}
