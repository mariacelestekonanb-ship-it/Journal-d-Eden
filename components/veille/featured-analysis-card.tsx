import Link from "next/link";
import { ArrowRight, Rocket, Cpu } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/veille/category-badge";
import { InstitutionBadge } from "@/components/veille/institution-badge";
import { ReadingTime } from "@/components/veille/reading-time";
import { formatDate } from "@/lib/format";
import type { VeilleItem } from "@/types";

export interface FeaturedAnalysisCardProps {
  item: VeilleItem;
}

/**
 * Carte visuelle pour « À ne pas manquer » : bandeau illustré (identité
 * bleu nuit + grille discrète, cohérente avec le Hero) au-dessus du
 * contenu, pour distinguer nettement les analyses mises en avant de la
 * liste standard (`AnalysisCard`).
 */
export function FeaturedAnalysisCard({ item }: FeaturedAnalysisCardProps) {
  const Icon = item.domaine === "droit-spatial" ? Rocket : Cpu;

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-navy-950 relative flex h-32 items-center justify-center overflow-hidden">
        <div className="bg-grid-navy absolute inset-0 opacity-40" aria-hidden />
        <span className="text-accent relative flex size-14 items-center justify-center rounded-full bg-white/10">
          <Icon className="size-7" aria-hidden />
        </span>
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge domaine={item.domaine} />
          <time
            dateTime={item.date}
            className="text-muted-foreground text-xs font-medium"
          >
            {formatDate(item.date)}
          </time>
        </div>

        <Heading as="h3" size="sm">
          {item.titre}
        </Heading>
        <Paragraph tone="muted" size="sm" className="line-clamp-3">
          {item.resume}
        </Paragraph>

        <div className="mt-1 flex items-center justify-between gap-3">
          <InstitutionBadge institution={item.source} />
          <ReadingTime minutes={item.tempsLecture} />
        </div>

        <Button asChild variant="accent" size="sm" className="mt-2 w-full">
          <Link href={`/veille-juridique/${item.slug}`}>
            Lire l&apos;analyse
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
