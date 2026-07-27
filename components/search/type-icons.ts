import { BookOpen, Newspaper, BookMarked, FolderOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { SearchResultType } from "@/lib/search";

/** Icône associée à chaque catégorie de résultat — source unique pour `SearchResult` et `SearchSection`. */
export const TYPE_ICONS: Record<SearchResultType, LucideIcon> = {
  fiche: BookOpen,
  analyse: Newspaper,
  glossaire: BookMarked,
  ressource: FolderOpen,
};
