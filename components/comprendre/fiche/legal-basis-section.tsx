import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { LegalReference } from "@/components/comprendre/fiche/legal-reference";
import type { ReferenceJuridique } from "@/types";

export interface LegalBasisSectionProps {
  id: string;
  references: ReferenceJuridique[];
}

const TEXTES_NORMATIFS = new Set([
  "Traité",
  "Loi",
  "Règlement",
  "Convention",
  "Directive",
]);

/**
 * « Ce que dit le droit » : ne montre que les textes normatifs (traités,
 * lois, règlements, conventions, directives) — les décisions et sites
 * officiels apparaissent dans la bibliographie complète (`ReferencesSection`).
 */
export function LegalBasisSection({ id, references }: LegalBasisSectionProps) {
  const textes = references.filter((reference) =>
    TEXTES_NORMATIFS.has(reference.type),
  );

  if (textes.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Ce que dit le droit
      </Heading>
      <Paragraph tone="muted" className="mt-2">
        Les textes qui fondent juridiquement la réponse.
      </Paragraph>
      <div className="mt-6 space-y-4">
        {textes.map((reference, index) => (
          <LegalReference key={index} reference={reference} />
        ))}
      </div>
    </section>
  );
}
