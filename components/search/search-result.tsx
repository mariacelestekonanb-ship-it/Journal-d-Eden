import { ArrowRight } from "lucide-react";

import { Tag } from "@/components/ui/tag";
import { TYPE_ICONS } from "@/components/search/type-icons";
import type { SearchResultItem } from "@/lib/search";

export interface SearchResultProps {
  item: SearchResultItem;
  isActive: boolean;
  onNavigate: (item: SearchResultItem) => void;
  onHover: (item: SearchResultItem) => void;
}

/**
 * Un résultat de la recherche globale. Rendu comme `role="option"` d'un
 * `role="listbox"` (voir `SearchSection`/`SearchDialog`) : un seul élément
 * interactif par option, conformément au motif ARIA combobox — « Ouvrir »
 * est une affordance visuelle, pas un bouton imbriqué distinct.
 */
export function SearchResult({
  item,
  isActive,
  onNavigate,
  onHover,
}: SearchResultProps) {
  const Icon = TYPE_ICONS[item.type];

  return (
    <li id={item.id} role="option" aria-selected={isActive}>
      <button
        type="button"
        onClick={() => onNavigate(item)}
        onMouseEnter={() => onHover(item)}
        className={`focus-visible:ring-ring flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none ${
          isActive ? "bg-secondary" : "hover:bg-secondary/60"
        }`}
      >
        <span
          aria-hidden
          className="bg-secondary text-navy-900 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full"
        >
          <Icon className="size-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-foreground truncate text-sm font-semibold">
              {item.titre}
            </span>
          </span>
          <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-xs">
            {item.resume}
          </span>
          {item.meta ? (
            <span className="text-muted-foreground/70 mt-0.5 block text-[11px]">
              {item.meta}
            </span>
          ) : null}
        </span>

        <span className="flex shrink-0 flex-col items-end gap-1.5 self-center">
          <Tag className="whitespace-nowrap">{item.typeLabel}</Tag>
          <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-medium">
            Ouvrir
            <ArrowRight className="size-3" aria-hidden />
          </span>
        </span>
      </button>
    </li>
  );
}
