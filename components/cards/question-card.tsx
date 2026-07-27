import Link from "next/link";
import { HelpCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { labelDomaine, niveauBadgeVariant } from "@/lib/format";
import type { QuestionItem } from "@/types";

export function QuestionCard({ item }: { item: QuestionItem }) {
  return (
    <Link
      href={`/comprendre/${item.slug}`}
      className="focus-visible:ring-ring focus-visible:ring-offset-background rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
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
          <Badge variant={niveauBadgeVariant(item.niveau)}>{item.niveau}</Badge>
        </div>
      </Card>
    </Link>
  );
}
