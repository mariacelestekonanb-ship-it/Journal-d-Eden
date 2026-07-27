import { Divider } from "@/components/ui/divider";
import {
  FilterPills,
  type FilterOption,
} from "@/components/shared/filter-pills";
import { themes } from "@/data/themes";
import type { Niveau } from "@/types";

export type SortKey = "recent" | "alphabetique" | "populaire";
export type NiveauFiltre = "tous" | Niveau;
export type ThemeFiltre = "tous" | string;
export type DureeFiltre = "tous" | "courte" | "moyenne" | "longue";

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

const dureeOptions: FilterOption<DureeFiltre>[] = [
  { value: "tous", label: "Toutes durées" },
  { value: "courte", label: "Moins de 5 min" },
  { value: "moyenne", label: "5 à 10 min" },
  { value: "longue", label: "Plus de 10 min" },
];

const sortOptions: FilterOption<SortKey>[] = [
  { value: "recent", label: "Plus récent" },
  { value: "alphabetique", label: "Ordre alphabétique" },
  { value: "populaire", label: "Les plus consultées" },
];

export interface FicheFiltersBarProps {
  theme: ThemeFiltre;
  onThemeChange: (value: ThemeFiltre) => void;
  niveau: NiveauFiltre;
  onNiveauChange: (value: NiveauFiltre) => void;
  duree: DureeFiltre;
  onDureeChange: (value: DureeFiltre) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
}

/**
 * Barre de filtres de « Toutes les fiches » : thème, niveau, durée de
 * lecture et tri, tous construits sur `FilterPills`/`Tag`. Les options de
 * thème dérivent de `data/themes.ts`, donc tout nouveau thème apparaît ici
 * automatiquement. Le tri « Les plus consultées » reste une simulation
 * tant qu'aucune vraie mesure d'audience n'est branchée (voir
 * `AllFichesExplorer`).
 */
export function FicheFiltersBar({
  theme,
  onThemeChange,
  niveau,
  onNiveauChange,
  duree,
  onDureeChange,
  sort,
  onSortChange,
}: FicheFiltersBarProps) {
  return (
    <div className="border-border bg-card flex flex-col gap-5 rounded-xl border p-5">
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

      <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
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
            Durée de lecture
          </span>
          <FilterPills
            label="Filtrer par durée de lecture"
            options={dureeOptions}
            value={duree}
            onChange={onDureeChange}
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
