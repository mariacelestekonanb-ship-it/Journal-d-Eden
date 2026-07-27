"use client";

import { Section } from "@/components/ui/section";
import { ContentErrorState } from "@/components/shared/content-error-state";

/**
 * Frontière d'erreur racine du site public (obligatoirement un Client
 * Component, exigence Next.js) : capte toute erreur non gérée par une
 * frontière plus spécifique. Réutilise `ContentErrorState`, déjà partagé
 * par les fiches, analyses et le glossaire pour ce même scénario.
 */
export default function RootError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <ContentErrorState
        title="Une erreur est survenue"
        description="Quelque chose s'est mal passé de notre côté. Vous pouvez réessayer, ou revenir à l'accueil."
        onRetry={reset}
        headingAs="h1"
      />
    </Section>
  );
}
