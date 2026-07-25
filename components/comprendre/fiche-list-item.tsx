import Link from "next/link";
import { Clock, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { formatDate, labelDomaine } from "@/lib/format";
import type { QuestionItem } from "@/types";

/**
 * Ligne compacte d'une fiche dans « Toutes les fiches » — un style de
 * bibliothèque documentaire (proche de Stripe Docs) plutôt qu'une carte,
 * pour rester lisible même avec un grand nombre d'entrées.
 */
export function FicheListItem({ item }: { item: QuestionItem }) {
  return (
    <Link
      href={`/comprendre/${item.slug}`}
      className="group hover:bg-secondary/50 border-border -mx-4 flex flex-col gap-3 rounded-xl border-b px-4 py-6 transition-colors last:border-none sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {item.niveau}
          </span>
        </div>
        <Heading
          as="h3"
          size="xs"
          className="group-hover:text-navy-900 mt-2 transition-colors"
        >
          {item.question}
        </Heading>
        <Paragraph tone="muted" size="sm" className="mt-1 line-clamp-1">
          {item.reponseCourte}
        </Paragraph>
      </div>

      <div className="text-muted-foreground flex shrink-0 items-center gap-4 text-xs sm:flex-col sm:items-end sm:gap-1.5">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden />
          {item.tempsLecture} min
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3.5" aria-hidden />
          {formatDate(item.dateMiseAJour)}
        </span>
      </div>
    </Link>
  );
}
