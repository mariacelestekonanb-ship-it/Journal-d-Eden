import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * Rend le fil d'Ariane accessible (lecteurs d'écran) et présent dans le
   * JSON-LD sans l'afficher visuellement — pour les pages d'index dont la
   * composition (hero pleine largeur) ne prévoit pas cet emplacement, sans
   * pour autant priver ces pages de `BreadcrumbList`.
   */
  visuallyHidden?: boolean;
}

/**
 * Fil d'Ariane générique (Accueil > Comprendre > Catégorie > Titre, ou
 * Accueil > Veille juridique > Catégorie > Titre). Le dernier élément est
 * toujours rendu comme texte courant (`aria-current`), jamais comme lien.
 * Émet aussi les données structurées `BreadcrumbList` correspondantes : un
 * seul appel à `<Breadcrumb>` couvre à la fois l'affichage et le SEO, sans
 * jamais risquer que les deux divergent.
 */
export function Breadcrumb({ items, visuallyHidden = false }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn("text-sm", visuallyHidden && "sr-only")}
    >
      <JsonLd data={buildBreadcrumbJsonLd(items)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 ? (
                <ChevronRight
                  aria-hidden
                  className="text-muted-foreground size-3.5 shrink-0"
                />
              ) : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-foreground max-w-[16rem] truncate font-medium sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
