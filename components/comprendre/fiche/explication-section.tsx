import { Heading } from "@/components/ui/heading";
import { ExplicationBlocks } from "@/components/comprendre/fiche/explication-blocks";
import type { ContentBlock } from "@/types";

export interface ExplicationSectionProps {
  id: string;
  blocks: ContentBlock[];
}

/** « Notre explication » : le cœur de la fiche, section la plus longue. */
export function ExplicationSection({ id, blocks }: ExplicationSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Notre explication
      </Heading>
      <div className="mt-6">
        <ExplicationBlocks blocks={blocks} />
      </div>
    </section>
  );
}
