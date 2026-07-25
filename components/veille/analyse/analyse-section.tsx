import { Heading } from "@/components/ui/heading";
import { ContentBlocks } from "@/components/shared/content-blocks";
import type { ContentBlock } from "@/types";

export interface AnalyseSectionProps {
  id: string;
  blocks: ContentBlock[];
}

/**
 * « Notre analyse » : la partie principale, celle qui distingue LexWatch
 * d'un simple relais d'actualité. Réutilise `ContentBlocks`, partagé avec
 * « Notre explication » (fiche pédagogique).
 */
export function AnalyseSection({ id, blocks }: AnalyseSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Notre analyse
      </Heading>
      <div className="mt-6">
        <ContentBlocks blocks={blocks} />
      </div>
    </section>
  );
}
