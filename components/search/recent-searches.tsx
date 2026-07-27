import { Clock, X } from "lucide-react";

export interface RecentSearchesProps {
  items: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClear: () => void;
}

/**
 * « Recherches récentes » : historique réellement persisté (voir
 * `useRecentSearches`), pas une liste fictive — affiché uniquement tant que
 * le champ est vide. Chaque entrée peut être relancée ou retirée
 * individuellement, indépendamment de « Effacer » (tout l'historique).
 */
export function RecentSearches({
  items,
  onSelect,
  onRemove,
  onClear,
}: RecentSearchesProps) {
  if (items.length === 0) return null;

  return (
    <div className="px-1">
      <div className="flex items-center justify-between px-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Recherches récentes
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Effacer
        </button>
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((query) => (
          <li key={query} className="group flex items-center rounded-xl">
            <button
              type="button"
              onClick={() => onSelect(query)}
              className="hover:bg-secondary focus-visible:ring-ring flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <Clock
                className="text-muted-foreground size-4 shrink-0"
                aria-hidden
              />
              <span className="line-clamp-1 flex-1">{query}</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(query)}
              aria-label={`Retirer « ${query} » de l'historique`}
              className="text-muted-foreground/50 hover:bg-secondary hover:text-foreground focus-visible:ring-ring mr-1 flex size-7 shrink-0 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
