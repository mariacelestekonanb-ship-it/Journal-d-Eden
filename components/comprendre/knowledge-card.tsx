import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, labelDomaine } from "@/lib/format";
import type { QuestionItem } from "@/types";

const niveauStyles: Record<QuestionItem["niveau"], string> = {
  Débutant: "border-transparent bg-accent/15 text-gold-600",
  Intermédiaire: "border-border text-foreground",
  Avancé: "border-transparent bg-navy-900 text-white",
};

export interface KnowledgeCardProps {
  item: QuestionItem;
}

/**
 * Carte d'une fiche dans « Toutes les fiches » : catégorie, titre, résumé,
 * niveau, temps de lecture, date de mise à jour et un bouton d'action
 * explicite (« Lire la fiche »), distincte de `QuestionSummaryCard`
 * (bouton « Comprendre », section Questions populaires) pour marquer la
 * différence entre découvrir une notion et parcourir la bibliothèque
 * complète.
 */
export function KnowledgeCard({ item }: KnowledgeCardProps) {
  return (
    <Card className="h-full justify-between transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${niveauStyles[item.niveau]}`}
          >
            {item.niveau}
          </span>
        </div>
        <CardTitle>{item.question}</CardTitle>
        <CardDescription className="line-clamp-2">
          {item.reponseCourte}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-stretch gap-4">
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {item.tempsLecture} min
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden />
            Mis à jour le {formatDate(item.dateMiseAJour)}
          </span>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/comprendre/${item.slug}`}>
            Lire la fiche
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
