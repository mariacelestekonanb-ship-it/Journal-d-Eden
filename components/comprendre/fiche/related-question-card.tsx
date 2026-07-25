import Link from "next/link";
import { Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { labelDomaine } from "@/lib/format";
import type { QuestionItem } from "@/types";

export interface RelatedQuestionCardProps {
  item: QuestionItem;
}

/** Carte compacte pour la section « Questions associées » d'une fiche. */
export function RelatedQuestionCard({ item }: RelatedQuestionCardProps) {
  return (
    <Link href={`/comprendre/${item.slug}`} className="group block h-full">
      <Card className="hover:border-accent/40 h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div>
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <Heading
            as="h3"
            size="xs"
            className="group-hover:text-navy-900 mt-3 transition-colors"
          >
            {item.question}
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
