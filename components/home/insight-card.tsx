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
import { formatDate } from "@/lib/format";
import type { VeilleItem } from "@/types";

/**
 * Carte « note de veille » de l'accueil : date, titre, résumé et bouton de
 * lecture. Distincte de `VeilleCard` (`components/cards`), qui pointe vers
 * une fiche de détail dédiée.
 */
export function InsightCard({ item }: { item: VeilleItem }) {
  return (
    <Card className="h-full justify-between transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <time
          dateTime={item.date}
          className="text-muted-foreground text-sm font-medium"
        >
          {formatDate(item.date)}
        </time>
        <CardTitle>{item.titre}</CardTitle>
        <CardDescription>{item.resume}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <Link href="/veille-juridique">
            Lire l&apos;analyse
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
