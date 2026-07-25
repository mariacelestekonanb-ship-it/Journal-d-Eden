"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Clock, SearchX } from "lucide-react";

import { Section } from "@/components/ui/section";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { useDisclosure } from "@/hooks/use-disclosure";
import { questions } from "@/data/questions";

/**
 * Historique de démonstration : aucune persistance réelle n'est branchée
 * pour l'instant (voir le commentaire plus bas), d'où cette liste statique.
 */
const recentSearchesDemo = ["RGPD", "Débris spatiaux", "AI Act"];

export interface SearchExperienceProps {
  initialQuery?: string;
}

/**
 * Barre de recherche de la page Comprendre. Suggestions et « aucun
 * résultat » filtrent réellement `data/questions.ts` côté client ;
 * l'historique reste une donnée de démonstration tant qu'aucune
 * persistance n'est connectée (localStorage ou compte utilisateur).
 */
export function SearchExperience({ initialQuery }: SearchExperienceProps) {
  const panel = useDisclosure();
  const [query, setQuery] = React.useState(initialQuery ?? "");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const suggestions = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length === 0) return [];
    return questions
      .filter((item) => item.question.toLowerCase().includes(normalized))
      .slice(0, 5);
  }, [query]);

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
          placeholder="Rechercher une notion, une question ou un sujet…"
          aria-expanded={panel.isOpen}
          aria-controls="comprendre-search-panel"
        />

        {panel.isOpen && (
          <div
            id="comprendre-search-panel"
            className="border-border bg-card absolute z-20 mt-3 w-full rounded-2xl border p-2 shadow-lg"
          >
            {!hasQuery ? (
              <div className="p-3">
                <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                  Recherches récentes
                </p>
                <ul className="mt-2 space-y-1">
                  {recentSearchesDemo.map((term) => (
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
            ) : showNoResults ? (
              <EmptyState
                icon={SearchX}
                title="Aucun résultat"
                description={`Aucune fiche ne correspond à « ${query} » pour le moment.`}
                className="border-none bg-transparent py-8"
              />
            ) : (
              <div className="p-3">
                <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                  Suggestions
                </p>
                <ul className="mt-2 space-y-1">
                  {suggestions.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/comprendre/${item.slug}`}
                        className="hover:bg-secondary focus-visible:ring-ring flex items-center gap-3 rounded-xl px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <Search
                          className="text-muted-foreground size-4 shrink-0"
                          aria-hidden
                        />
                        <span className="line-clamp-1">{item.question}</span>
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
