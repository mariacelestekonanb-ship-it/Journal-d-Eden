"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Clock, SearchX } from "lucide-react";

import { Section } from "@/components/ui/section";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { useDisclosure } from "@/hooks/use-disclosure";

export interface SearchableItem {
  key: string;
  label: string;
  href: string;
}

export interface SearchExperienceProps {
  items: SearchableItem[];
  placeholder: string;
  /** Id unique du panneau de résultats — deux instances sur une même page ne doivent pas le partager. */
  panelId: string;
  recentSearches?: string[];
  initialQuery?: string;
  /** Nom du type d'élément recherché, utilisé dans le message « aucun résultat » (ex. "fiche", "analyse"). */
  resultLabel?: string;
}

/**
 * Barre de recherche générique avec suggestions, historique de démonstration
 * et « aucun résultat ». Filtre réellement `items` côté client (aucune
 * fonctionnalité fictive) ; l'historique reste une donnée statique tant
 * qu'aucune persistance n'est connectée. Réutilisée par Comprendre et
 * Veille juridique — chaque page se contente de reformater ses propres
 * données en `SearchableItem[]` (clé, libellé, lien).
 *
 * Les items sont volontairement de simples objets sérialisables plutôt que
 * des accesseurs (`getLabel`, `getHref`…) : ce composant est un Client
 * Component, et une fonction ne peut pas traverser la frontière
 * Server → Client Component en tant que prop.
 */
export function SearchExperience({
  items,
  placeholder,
  panelId,
  recentSearches = [],
  initialQuery,
  resultLabel = "élément",
}: SearchExperienceProps) {
  const panel = useDisclosure();
  const [query, setQuery] = React.useState(initialQuery ?? "");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const suggestions = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length === 0) return [];
    return items
      .filter((item) => item.label.toLowerCase().includes(normalized))
      .slice(0, 5);
  }, [items, query]);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        panel.close();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [panel]);

  const hasQuery = query.trim().length > 0;
  const showNoResults = hasQuery && suggestions.length === 0;

  return (
    <Section spacing="lg">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-2xl"
        onKeyDown={(event) => {
          if (event.key === "Escape") panel.close();
        }}
      >
        <SearchInput
          size="lg"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={panel.open}
          placeholder={placeholder}
          aria-expanded={panel.isOpen}
          aria-controls={panelId}
        />

        {panel.isOpen && (
          <div
            id={panelId}
            className="border-border bg-card absolute z-20 mt-3 w-full rounded-2xl border p-2 shadow-lg"
          >
            {!hasQuery ? (
              recentSearches.length > 0 && (
                <div className="p-3">
                  <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                    Recherches récentes
                  </p>
                  <ul className="mt-2 space-y-1">
                    {recentSearches.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="hover:bg-secondary focus-visible:ring-ring flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <Clock
                            className="text-muted-foreground size-4"
                            aria-hidden
                          />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ) : showNoResults ? (
              <EmptyState
                icon={SearchX}
                title="Aucun résultat"
                description={`Aucun ${resultLabel} ne correspond à « ${query} » pour le moment.`}
                className="border-none bg-transparent py-8"
              />
            ) : (
              <div className="p-3">
                <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                  Suggestions
                </p>
                <ul className="mt-2 space-y-1">
                  {suggestions.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        className="hover:bg-secondary focus-visible:ring-ring flex items-center gap-3 rounded-xl px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <Search
                          className="text-muted-foreground size-4 shrink-0"
                          aria-hidden
                        />
                        <span className="line-clamp-1">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
