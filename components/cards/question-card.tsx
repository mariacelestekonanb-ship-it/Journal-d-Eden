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
      <Card className="hover:border-accent/50 h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start gap-3">
          <div className="bg-secondary text-navy-900 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
            <HelpCircle className="size-4.5" />
          </div>
          <h3 className="font-heading text-foreground text-base leading-snug font-semibold">
            {item.question}
          </h3>
        </div>

        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
          {item.reponseCourte}
        </p>

        <div className="border-border mt-6 flex items-center justify-between border-t pt-4">
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
