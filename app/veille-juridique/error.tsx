"use client";

import { Section } from "@/components/ui/section";
import { ContentErrorState } from "@/components/shared/content-error-state";

/**
 * Frontière d'erreur de la liste de veille juridique (obligatoirement un
 * Client Component, exigence Next.js). Réutilise `ContentErrorState`,
 * partagé avec le Glossaire, Comprendre et les pages de détail pour ce
 * même scénario.
 */
export default function VeilleJuridiqueError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <ContentErrorState
        title="Impossible de charger la veille juridique"
        onRetry={reset}
        headingAs="h1"
      />
    </Section>
  );
}
