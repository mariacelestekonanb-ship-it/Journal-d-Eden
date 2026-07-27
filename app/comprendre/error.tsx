"use client";

import { Section } from "@/components/ui/section";
import { ContentErrorState } from "@/components/shared/content-error-state";

/**
 * Frontière d'erreur de la bibliothèque Comprendre (obligatoirement un
 * Client Component, exigence Next.js). Réutilise `ContentErrorState`,
 * partagé avec le Glossaire et les pages de détail pour ce même scénario.
 */
export default function ComprendreError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <ContentErrorState
        title="Impossible de charger les fiches"
        onRetry={reset}
        headingAs="h1"
      />
    </Section>
  );
}
