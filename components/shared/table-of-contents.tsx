"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

export interface TableOfContentsProps {
  items: TocItem[];
}

/**
 * Sommaire d'une page de contenu long (fiche, analyse de veille) avec suivi
 * de la section active (IntersectionObserver) pendant le défilement.
 * `rootMargin` restreint la zone de détection à la partie haute du viewport
 * pour un surlignage qui correspond à ce que le lecteur est réellement en
 * train de lire.
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string | null>(
    items[0]?.id ?? null,
  );

  React.useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-112px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Sommaire">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Sommaire
      </p>
      <ul className="border-border mt-3 space-y-1 border-l">
        {items.map((item) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "focus-visible:ring-ring -ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  isActive
                    ? "border-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
