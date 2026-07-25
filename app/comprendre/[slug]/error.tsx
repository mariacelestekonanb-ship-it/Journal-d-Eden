"use client";

import { Section } from "@/components/ui/section";
import { FicheErrorState } from "@/components/comprendre/fiche-error-state";

/**
 * Frontière d'erreur de la fiche (obligatoirement un Client Component,
 * exigence Next.js). Réutilise `FicheErrorState`, déjà prévu sur la page
 * Comprendre pour ce même scénario.
 */
export default function FicheError({ reset }: { reset: () => void }) {
  return (
    <Section spacing="lg">
      <FicheErrorState onRetry={reset} />
    </Section>
  );
}
