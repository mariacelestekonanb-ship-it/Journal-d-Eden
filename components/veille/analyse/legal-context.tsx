import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { LegalReference } from "@/components/shared/legal-reference";
import type { ReferenceJuridique } from "@/types";

export interface LegalContextProps {
  id: string;
  references: ReferenceJuridique[];
}

/**
 * « Le contexte juridique » : les textes qui fondent juridiquement
 * l'analyse (conventions, règlements, directives, lois, décisions,
 * jurisprudence). Réutilise `LegalReference`, partagé avec la fiche
 * pédagogique pour cette même carte de citation.
 */
export function LegalContext({ id, references }: LegalContextProps) {
  if (references.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Le contexte juridique
      </Heading>
      <Paragraph tone="muted" className="mt-2">
        Les règles applicables à cette actualité.
      </Paragraph>
      <div className="mt-6 space-y-4">
        {references.map((reference, index) => (
          <LegalReference key={index} reference={reference} />
        ))}
      </div>
    </section>
  );
}
