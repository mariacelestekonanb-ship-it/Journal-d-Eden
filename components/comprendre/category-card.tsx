import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { resolveIcon } from "@/components/cards/icon-map";
import type { Theme } from "@/types";

export interface CategoryCardProps {
  theme: Theme;
  /** Thème actuellement sélectionné dans « Toutes les fiches » (mise en avant visuelle). */
  active?: boolean;
}

/**
 * Grande carte de thème pour la section Catégories : icône, titre,
 * description et nombre indicatif de fiches. Le lien pointe vers la page
 * elle-même avec `?theme=`, lu côté serveur pour pré-filtrer « Toutes les
 * fiches » sans JavaScript supplémentaire.
 */
export function CategoryCard({ theme, active = false }: CategoryCardProps) {
  const Icon = resolveIcon(theme.icone);

  return (
    <Link
      href={`/comprendre?theme=${theme.slug}`}
      className="group block h-full"
    >
      <Card
        className={cn(
          "hover:border-accent/40 h-full justify-between p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          active && "border-accent ring-accent/30 ring-1",
        )}
      >
        <div className="flex items-start justify-between">
          <div className="bg-navy-900 group-hover:bg-accent group-hover:text-accent-foreground flex size-12 items-center justify-center rounded-xl text-white transition-colors">
            <Icon className="size-6" aria-hidden />
          </div>
          <ArrowUpRight
            aria-hidden
            className="text-muted-foreground size-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>

        <div className="mt-6">
          <Heading as="h3" size="sm">
            {theme.titre}
          </Heading>
          <Paragraph tone="muted" size="sm" className="mt-2">
            {theme.description}
          </Paragraph>
        </div>

        <p className="text-muted-foreground mt-6 text-xs font-medium">
          {theme.nombreFichesApprox} fiches
        </p>
      </Card>
    </Link>
  );
}
