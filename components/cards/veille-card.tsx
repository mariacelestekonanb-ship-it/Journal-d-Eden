import Link from "next/link";
import { Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, labelDomaine } from "@/lib/format";
import type { VeilleItem } from "@/types";

export function VeilleCard({ item }: { item: VeilleItem }) {
  return (
    <Link href={`/veille-juridique/${item.slug}`}>
      <Card className="h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <time
            dateTime={item.date}
            className="text-xs font-medium text-muted-foreground"
          >
            {formatDate(item.date)}
          </time>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
            {item.titre}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {item.resume}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="font-medium">{item.source}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {item.tempsLecture} min de lecture
          </span>
        </div>
      </Card>
    </Link>
  );
}
