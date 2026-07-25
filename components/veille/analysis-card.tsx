import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { CategoryBadge } from "@/components/veille/category-badge";
import { InstitutionBadge } from "@/components/veille/institution-badge";
import { ReadingTime } from "@/components/veille/reading-time";
import { formatDate } from "@/lib/format";
import type { VeilleItem } from "@/types";

export interface AnalysisCardProps {
  item: VeilleItem;
}

/**
 * Carte d'analyse pour la liste « Analyses récentes ». Contrairement à un
 * simple lien de blog, chaque carte porte la catégorie, l'institution
 * source, le type de publication et le temps de lecture avant même
 * d'ouvrir l'analyse.
 */
export function AnalysisCard({ item }: AnalysisCardProps) {
  return (
    <Card className="h-full justify-between transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <time
            dateTime={item.date}
            className="text-muted-foreground text-xs font-medium"
          >
            {formatDate(item.date)}
          </time>
          <Tag>{item.type}</Tag>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <CategoryBadge domaine={item.domaine} />
          <InstitutionBadge institution={item.source} />
        </div>
        <CardTitle className="mt-2">{item.titre}</CardTitle>
        <CardDescription className="line-clamp-3">
          {item.resume}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between gap-3">
        <ReadingTime minutes={item.tempsLecture} />
        <Button asChild variant="outline" size="sm">
          <Link href={`/veille-juridique/${item.slug}`}>
            Lire l&apos;analyse
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
