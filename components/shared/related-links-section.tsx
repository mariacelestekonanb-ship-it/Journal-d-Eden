import Link from "next/link";
import { ArrowRight, BookMarked, FolderOpen } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import type { LienConnexe } from "@/lib/internal-links";

export interface RelatedLinksSectionProps {
  id?: string;
  items: LienConnexe[];
}

const ICONS = { glossaire: BookMarked, ressource: FolderOpen } as const;
const LABELS = { glossaire: "Glossaire", ressource: "Ressource" } as const;

/**
 * « Pour aller plus loin » : maillage interne inverse (voir
 * `getLiensConnexes`) — termes du glossaire et ressources en lien avec une
 * fiche pédagogique ou une analyse de veille. Complète les sections
 * « contenus associés » déjà existantes (fiches entre elles, analyses entre
 * elles), qui ne couvraient pas ces deux directions.
 */
export function RelatedLinksSection({ id, items }: RelatedLinksSectionProps) {
  if (items.length === 0) return null;

  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-28">
      <Heading id={headingId} as="h2" size="md">
        Pour aller plus loin
      </Heading>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item, index) => {
          const Icon = ICONS[item.type];
          const content = (
            <Card className="hover:border-accent/40 h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="bg-secondary text-navy-900 flex size-9 shrink-0 items-center justify-center rounded-full"
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {LABELS[item.type]}
                  </p>
                  <p className="font-heading text-foreground mt-0.5 line-clamp-1 text-sm font-semibold">
                    {item.titre}
                  </p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {item.description}
                  </p>
                </div>
                <ArrowRight
                  aria-hidden
                  className="text-muted-foreground mt-1 size-4 shrink-0"
                />
              </div>
            </Card>
          );

          return item.external ? (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="block h-full"
            >
              {content}
            </a>
          ) : (
            <Link key={index} href={item.href} className="block h-full">
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
