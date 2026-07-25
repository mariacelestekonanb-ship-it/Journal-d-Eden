import { Divider } from "@/components/ui/divider";
import {
  FilterPills,
  type FilterOption,
} from "@/components/comprendre/filter-pills";
import { themes } from "@/data/themes";
import type { Niveau } from "@/types";

export type SortKey = "recent" | "alphabetique";
export type NiveauFiltre = "tous" | Niveau;
export type ThemeFiltre = "tous" | string;

const themeOptions: FilterOption<ThemeFiltre>[] = [
  { value: "tous", label: "Tous les thèmes" },
  ...themes.map((theme) => ({ value: theme.slug, label: theme.titre })),
];

const niveauOptions: FilterOption<NiveauFiltre>[] = [
  { value: "tous", label: "Tous niveaux" },
  { value: "Débutant", label: "Débutant" },
  { value: "Intermédiaire", label: "Intermédiaire" },
  { value: "Avancé", label: "Avancé" },
];

const sortOptions: FilterOption<SortKey>[] = [
  { value: "recent", label: "Plus récent" },
  { value: "alphabetique", label: "Ordre alphabétique" },
];

export interface FicheFiltersBarProps {
  theme: ThemeFiltre;
  onThemeChange: (value: ThemeFiltre) => void;
  niveau: NiveauFiltre;
  onNiveauChange: (value: NiveauFiltre) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
}

/**
 * Barre de filtres de « Toutes les fiches » : thème, niveau et tri, tous
 * construits sur `FilterPills`/`Tag`. Les options de thème dérivent de
 * `data/themes.ts`, donc tout nouveau thème apparaît ici automatiquement.
 */
export function FicheFiltersBar({
  theme,
  onThemeChange,
  niveau,
  onNiveauChange,
  sort,
  onSortChange,
}: FicheFiltersBarProps) {
  return (
    <div className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Thème
        </span>
        <FilterPills
          label="Filtrer par thème"
          options={themeOptions}
          value={theme}
          onChange={onThemeChange}
        />
      </div>

      <Divider />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Niveau
          </span>
          <FilterPills
            label="Filtrer par niveau"
            options={niveauOptions}
            value={niveau}
            onChange={onNiveauChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Trier par
          </span>
          <FilterPills
            label="Trier les fiches"
            options={sortOptions}
            value={sort}
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
}
