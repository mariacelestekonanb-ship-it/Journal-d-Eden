import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { labelDomaine } from "@/lib/format";
import type { QuestionItem } from "@/types";

/**
 * Carte « question populaire » de l'accueil : catégorie, question, réponse
 * rapide et bouton d'appel à l'action. Distincte de `QuestionCard`
 * (`components/cards`), qui pointe vers une fiche de détail dédiée.
 */
export function QuestionPreviewCard({ question }: { question: QuestionItem }) {
  return (
    <Card className="h-full justify-between transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <Badge
          variant={question.domaine === "droit-spatial" ? "navy" : "accent"}
          className="w-fit"
        >
          {labelDomaine(question.domaine)}
        </Badge>
        <CardTitle>{question.question}</CardTitle>
        <CardDescription>{question.reponseCourte}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <Link href="/comprendre">
            Comprendre
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
