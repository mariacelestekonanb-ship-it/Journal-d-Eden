import Link from "next/link";
import { Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { CategoryBadge } from "@/components/veille/category-badge";
import type { VeilleItem } from "@/types";

export interface RelatedAnalysisCardProps {
  item: VeilleItem;
}

/** Carte compacte pour la section « Analyses similaires » d'une analyse. */
export function RelatedAnalysisCard({ item }: RelatedAnalysisCardProps) {
  return (
    <Link
      href={`/veille-juridique/${item.slug}`}
      className="group block h-full"
    >
      <Card className="hover:border-accent/40 h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div>
          <CategoryBadge domaine={item.domaine} />
          <Heading
            as="h3"
            size="xs"
            className="group-hover:text-navy-900 mt-3 transition-colors"
          >
            {item.titre}
          </Heading>
        </div>
        <span className="text-muted-foreground mt-4 flex items-center gap-1 text-xs">
          <Clock className="size-3.5" aria-hidden />
          {item.tempsLecture} min de lecture
        </span>
      </Card>
    </Link>
  );
}
