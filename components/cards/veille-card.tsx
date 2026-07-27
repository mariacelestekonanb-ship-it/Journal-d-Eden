import Link from "next/link";
import { Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, labelDomaine } from "@/lib/format";
import type { VeilleItem } from "@/types";

export function VeilleCard({ item }: { item: VeilleItem }) {
  return (
    <Link
      href={`/veille-juridique/${item.slug}`}
      className="focus-visible:ring-ring focus-visible:ring-offset-background rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <Card className="hover:border-accent/50 h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <time
            dateTime={item.date}
            className="text-muted-foreground text-xs font-medium"
          >
            {formatDate(item.date)}
          </time>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-heading text-foreground text-lg leading-snug font-semibold">
            {item.titre}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {item.resume}
          </p>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 text-xs">
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
