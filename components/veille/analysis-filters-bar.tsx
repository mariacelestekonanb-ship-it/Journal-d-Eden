import { Divider } from "@/components/ui/divider";
import {
  FilterPills,
  type FilterOption,
} from "@/components/shared/filter-pills";
import { themes } from "@/data/themes";
import type { TypeVeille } from "@/types";

export type SortKey = "recent" | "ancien";
export type ThemeFiltre = "tous" | string;
export type TypeFiltre = "tous" | TypeVeille;

const themeOptions: FilterOption<ThemeFiltre>[] = [
  { value: "tous", label: "Tous les domaines" },
  ...themes.map((theme) => ({ value: theme.slug, label: theme.titre })),
];

const typeOptions: FilterOption<TypeFiltre>[] = [
  { value: "tous", label: "Tous les types" },
  { value: "Décision", label: "Décision" },
  { value: "Loi", label: "Loi" },
  { value: "Règlement", label: "Règlement" },
  { value: "Convention", label: "Convention" },
  { value: "Jurisprudence", label: "Jurisprudence" },
  { value: "Institution", label: "Institution" },
];

const sortOptions: FilterOption<SortKey>[] = [
  { value: "recent", label: "Plus récent" },
  { value: "ancien", label: "Plus ancien" },
];

export interface AnalysisFiltersBarProps {
  domaine: ThemeFiltre;
  onDomaineChange: (value: ThemeFiltre) => void;
  type: TypeFiltre;
  onTypeChange: (value: TypeFiltre) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
}

/**
 * Barre de filtres des analyses : domaine (thèmes de `data/themes.ts`),
 * type de publication et tri chronologique. Même composition que
 * `FicheFiltersBar` sur Comprendre, avec un jeu d'options propre à la veille.
 */
export function AnalysisFiltersBar({
  domaine,
  onDomaineChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
}: AnalysisFiltersBarProps) {
  return (
    <div className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Domaine
        </span>
        <FilterPills
          label="Filtrer par domaine"
          options={themeOptions}
          value={domaine}
          onChange={onDomaineChange}
        />
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Type
        </span>
        <FilterPills
          label="Filtrer par type"
          options={typeOptions}
          value={type}
          onChange={onTypeChange}
        />
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Trier par
        </span>
        <FilterPills
          label="Trier les analyses"
          options={sortOptions}
          value={sort}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}
