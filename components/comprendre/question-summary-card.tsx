import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { labelDomaine, niveauBadgeVariant } from "@/lib/format";
import type { QuestionItem } from "@/types";

/**
 * Carte « question populaire » : catégorie, difficulté, résumé et temps de
 * lecture, avec un bouton d'action explicite (exigé par le PRD, à la
 * différence de `QuestionCard` qui rend toute la carte cliquable).
 */
export function QuestionSummaryCard({ item }: { item: QuestionItem }) {
  return (
    <Card className="h-full justify-between transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <Badge variant={niveauBadgeVariant(item.niveau)}>{item.niveau}</Badge>
        </div>
        <CardTitle>{item.question}</CardTitle>
        <CardDescription className="line-clamp-2">
          {item.reponseCourte}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="size-3.5" aria-hidden />
          {item.tempsLecture} min de lecture
        </span>
        <Button asChild variant="outline" size="sm">
          <Link href={`/comprendre/${item.slug}`}>
            Comprendre
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
