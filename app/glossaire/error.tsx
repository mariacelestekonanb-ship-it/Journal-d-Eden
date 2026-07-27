"use client";

import { Section } from "@/components/ui/section";
import { ContentErrorState } from "@/components/shared/content-error-state";

/**
 * Frontière d'erreur du Glossaire (obligatoirement un Client Component,
 * exigence Next.js). Réutilise `ContentErrorState`, partagé avec les fiches
 * pédagogiques et les analyses de veille pour ce même scénario.
 */
export default function GlossaireError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <ContentErrorState
        title="Impossible de charger le glossaire"
        onRetry={reset}
        headingAs="h1"
      />
    </Section>
  );
}
