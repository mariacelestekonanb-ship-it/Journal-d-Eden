import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resolveIcon } from "@/components/cards/icon-map";
import { labelDomaine } from "@/lib/format";
import type { Categorie } from "@/types";
import { ArrowUpRight } from "lucide-react";

export function CategorieCard({ categorie }: { categorie: Categorie }) {
  const Icon = resolveIcon(categorie.icone);

  return (
    <Link href={`/veille-juridique?categorie=${categorie.slug}`}>
      <Card className="group h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-xl bg-navy-900 text-white transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            <Icon className="size-6" />
          </div>
          <ArrowUpRight className="size-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
            {categorie.titre}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {categorie.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <Badge variant="outline">{labelDomaine(categorie.domaine)}</Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {categorie.nombreArticles} articles
          </span>
        </div>
      </Card>
    </Link>
  );
}
