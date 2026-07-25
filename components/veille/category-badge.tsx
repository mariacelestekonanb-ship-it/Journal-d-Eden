import { Badge } from "@/components/ui/badge";
import { labelDomaine } from "@/lib/format";
import type { Domaine } from "@/types";

export interface CategoryBadgeProps {
  domaine: Domaine;
}

/** Étiquette de domaine (droit spatial / droit du numérique) d'une analyse. */
export function CategoryBadge({ domaine }: CategoryBadgeProps) {
  return (
    <Badge variant={domaine === "droit-spatial" ? "navy" : "accent"}>
      {labelDomaine(domaine)}
    </Badge>
  );
}
