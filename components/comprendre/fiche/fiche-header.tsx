import { Clock, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { SummaryBox } from "@/components/comprendre/fiche/summary-box";
import { ShareButtons } from "@/components/comprendre/fiche/share-buttons";
import { formatDate, labelDomaine } from "@/lib/format";
import type { QuestionItem, Theme } from "@/types";

export interface FicheHeaderProps {
  question: QuestionItem;
  theme?: Theme;
  url: string;
}

/** En-tête de fiche : catégorie, niveau, temps de lecture, mise à jour, titre, résumé et partage. */
export function FicheHeader({ question, theme, url }: FicheHeaderProps) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={question.domaine === "droit-spatial" ? "navy" : "accent"}
        >
          {theme?.titre ?? labelDomaine(question.domaine)}
        </Badge>
        <Badge variant="outline">{question.niveau}</Badge>
        <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
          <Clock className="size-3.5" aria-hidden />
          {question.tempsLecture} min de lecture
        </span>
        <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
          <CalendarDays className="size-3.5" aria-hidden />
          Mis à jour le {formatDate(question.dateMiseAJour)}
        </span>
      </div>

      <Heading as="h1" size="xl" className="mt-5">
        {question.question}
      </Heading>

      <div className="mt-4">
        <SummaryBox text={question.reponseCourte} />
      </div>

      <div className="mt-6">
        <ShareButtons url={url} title={question.question} />
      </div>
    </header>
  );
}
