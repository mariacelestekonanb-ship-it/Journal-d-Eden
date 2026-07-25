import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { FeaturedAnalysisCard } from "@/components/veille/featured-analysis-card";
import type { VeilleItem } from "@/types";

export interface FeaturedAnalysesSectionProps {
  items: VeilleItem[];
}

/** Section « À ne pas manquer » : les analyses les plus importantes du moment. */
export function FeaturedAnalysesSection({
  items,
}: FeaturedAnalysesSectionProps) {
  if (items.length === 0) return null;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          À ne pas manquer
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Les analyses les plus importantes du moment, à lire en priorité.
        </Paragraph>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <FeaturedAnalysisCard key={item.slug} item={item} />
        ))}
      </div>
    </>
  );
}
