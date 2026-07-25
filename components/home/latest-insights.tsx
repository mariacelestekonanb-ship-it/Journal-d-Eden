import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/home/insight-card";
import { veilleItems } from "@/data/veille";

const featuredInsights = veilleItems.filter((item) => item.aLaUne).slice(0, 3);

/** Section « Dernières notes de veille » : trois analyses juridiques récentes. */
export function LatestInsights() {
  return (
    <Section tone="muted">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Heading as="h2" size="lg">
            Dernières notes de veille
          </Heading>
          <Paragraph tone="muted" size="lg" className="mt-4 max-w-xl">
            Les évolutions juridiques les plus récentes, décryptées par la
            rédaction.
          </Paragraph>
        </div>
        <Button asChild variant="outline">
          <Link href="/veille-juridique">
            Toute la veille
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredInsights.map((item) => (
          <InsightCard key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  );
}
