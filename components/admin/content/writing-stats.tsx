import { Type, Clock } from "lucide-react";

import { countWords, estimateReadingTime } from "@/lib/admin/reading-time";
import type { ContentBlock } from "@/types";

export interface WritingStatsProps {
  blocks: ContentBlock[];
}

/** Compteur de mots et temps de lecture estimé du corps de texte — recalculé à chaque frappe, jamais stocké séparément du contenu lui-même. */
export function WritingStats({ blocks }: WritingStatsProps) {
  const words = countWords(blocks);
  const minutes = estimateReadingTime(blocks);

  return (
    <div className="text-muted-foreground flex items-center gap-4 text-xs">
      <span className="flex items-center gap-1.5">
        <Type className="size-3.5" aria-hidden />
        {words} mot{words > 1 ? "s" : ""}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden />
        {minutes > 0
          ? `${minutes} min de lecture estimée`
          : "Moins d'une minute"}
      </span>
    </div>
  );
}
