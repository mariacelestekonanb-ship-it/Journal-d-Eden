import { Heading } from "@/components/ui/heading";
import { Timeline } from "@/components/shared/timeline";
import type { EvenementChronologie } from "@/types";

export interface ChronologieSectionProps {
  id: string;
  evenements: EvenementChronologie[];
}

/** « Les faits » : chronologie des événements ayant mené à cette analyse. */
export function ChronologieSection({
  id,
  evenements,
}: ChronologieSectionProps) {
  if (evenements.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Les faits
      </Heading>
      <div className="mt-6">
        <Timeline evenements={evenements} />
      </div>
    </section>
  );
}
