import { Heading } from "@/components/ui/heading";
import { RelatedAnalysisCard } from "@/components/veille/analyse/related-analysis-card";
import type { VeilleItem } from "@/types";

export interface RelatedAnalysesSectionProps {
  id: string;
  items: VeilleItem[];
}

/** « Analyses similaires » : analyses liées pour poursuivre la lecture. */
export function RelatedAnalysesSection({
  id,
  items,
}: RelatedAnalysesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Analyses similaires
      </Heading>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <RelatedAnalysisCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
