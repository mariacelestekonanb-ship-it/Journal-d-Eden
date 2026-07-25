import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { LegalReference } from "@/components/comprendre/fiche/legal-reference";
import type { ReferenceJuridique, TypeReference } from "@/types";

export interface ReferencesSectionProps {
  id: string;
  references: ReferenceJuridique[];
}

const PLURAL_LABELS: Record<TypeReference, string> = {
  Traité: "Traités",
  Loi: "Lois",
  Règlement: "Règlements",
  Convention: "Conventions",
  Directive: "Directives",
  Décision: "Décisions",
  "Site officiel": "Sites officiels",
};

/**
 * « Références » : bibliographie complète de la fiche, groupée par type
 * (traités, lois, règlements, décisions, sites officiels…). Contrairement à
 * « Ce que dit le droit », rien n'est filtré ici — c'est la liste
 * exhaustive des sources.
 */
export function ReferencesSection({ id, references }: ReferencesSectionProps) {
  const grouped = new Map<TypeReference, ReferenceJuridique[]>();
  for (const reference of references) {
    const group = grouped.get(reference.type) ?? [];
    group.push(reference);
    grouped.set(reference.type, group);
  }

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Références
      </Heading>
      <Paragraph tone="muted" className="mt-2">
        L&apos;ensemble des sources citées dans cette fiche.
      </Paragraph>
      <div className="mt-6 space-y-8">
        {Array.from(grouped.entries()).map(([type, refs]) => (
          <div key={type}>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {PLURAL_LABELS[type]}
            </p>
            <div className="mt-3 space-y-3">
              {refs.map((reference, index) => (
                <LegalReference key={index} reference={reference} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
