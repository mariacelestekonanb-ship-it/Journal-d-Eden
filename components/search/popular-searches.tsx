import { TrendingUp } from "lucide-react";

import { Tag } from "@/components/ui/tag";

export interface PopularSearchesProps {
  items: string[];
  onSelect: (query: string) => void;
}

/**
 * « Recherches populaires » : suggestions de démonstration (voir
 * `RECHERCHES_POPULAIRES`), affichées uniquement tant que le champ est
 * vide, aux côtés de l'historique réel.
 */
export function PopularSearches({ items, onSelect }: PopularSearchesProps) {
  if (items.length === 0) return null;

  return (
    <div className="px-2 py-2">
      <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
        <TrendingUp className="size-3.5" aria-hidden />
        Recherches populaires
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((query) => (
          <Tag key={query} asButton onClick={() => onSelect(query)}>
            {query}
          </Tag>
        ))}
      </div>
    </div>
  );
}
