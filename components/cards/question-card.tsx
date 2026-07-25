import Link from "next/link";
import { HelpCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { labelDomaine } from "@/lib/format";
import type { QuestionItem } from "@/types";

const niveauStyles: Record<QuestionItem["niveau"], string> = {
  Débutant: "border-transparent bg-accent/15 text-gold-600",
  Intermédiaire: "border-border text-foreground",
  Avancé: "border-transparent bg-navy-900 text-white",
};

export function QuestionCard({ item }: { item: QuestionItem }) {
  return (
    <Link href={`/comprendre/${item.slug}`}>
      <Card className="h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-navy-900">
            <HelpCircle className="size-4.5" />
          </div>
          <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
            {item.question}
          </h3>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {item.reponseCourte}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <Badge variant="outline">{labelDomaine(item.domaine)}</Badge>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${niveauStyles[item.niveau]}`}
          >
            {item.niveau}
          </span>
        </div>
      </Card>
    </Link>
  );
}
