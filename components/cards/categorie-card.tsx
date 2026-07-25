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
      <Card className="group hover:border-accent/50 h-full justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="bg-navy-900 group-hover:bg-accent group-hover:text-accent-foreground flex size-12 items-center justify-center rounded-xl text-white transition-colors">
            <Icon className="size-6" />
          </div>
          <ArrowUpRight className="text-muted-foreground size-5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="font-heading text-foreground text-lg leading-snug font-semibold">
            {categorie.titre}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {categorie.description}
          </p>
        </div>

        <div className="border-border mt-6 flex items-center justify-between border-t pt-4">
          <Badge variant="outline">{labelDomaine(categorie.domaine)}</Badge>
          <span className="text-muted-foreground text-xs font-medium">
            {categorie.nombreArticles} articles
          </span>
        </div>
      </Card>
    </Link>
  );
}
