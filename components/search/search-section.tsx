import { SearchResult } from "@/components/search/search-result";
import { TYPE_ICONS } from "@/components/search/type-icons";
import type { SearchResultItem, SearchResultType } from "@/lib/search";

export interface SearchSectionProps {
  type: SearchResultType;
  titre: string;
  items: SearchResultItem[];
  activeId: string | null;
  onNavigate: (item: SearchResultItem) => void;
  onHover: (item: SearchResultItem) => void;
}

/** Un groupe de résultats (« 📚 Comprendre », « 📰 Veille juridique »…) dans la modale de recherche. */
export function SearchSection({
  type,
  titre,
  items,
  activeId,
  onNavigate,
  onHover,
}: SearchSectionProps) {
  if (items.length === 0) return null;

  const Icon = TYPE_ICONS[type];

  return (
    <div>
      <p className="text-muted-foreground flex items-center gap-2 px-3 text-xs font-medium tracking-wide uppercase">
        <Icon className="size-3.5" aria-hidden />
        {titre}
      </p>
      <ul role="group" aria-label={titre} className="mt-1 space-y-0.5">
        {items.map((item) => (
          <SearchResult
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onNavigate={onNavigate}
            onHover={onHover}
          />
        ))}
      </ul>
    </div>
  );
}
