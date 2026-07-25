import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { OfficialReference } from "@/components/veille/analyse/official-reference";
import type { ReferenceOfficielle } from "@/types";

export interface OfficialReferencesSectionProps {
  id: string;
  references: ReferenceOfficielle[];
}

/** « Références officielles » : textes, communiqués, sites et documents cités en source. */
export function OfficialReferencesSection({
  id,
  references,
}: OfficialReferencesSectionProps) {
  if (references.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Références officielles
      </Heading>
      <Paragraph tone="muted" className="mt-2">
        Les sources primaires à consulter pour aller plus loin.
      </Paragraph>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {references.map((reference, index) => (
          <OfficialReference key={index} reference={reference} />
        ))}
      </div>
    </section>
  );
}
