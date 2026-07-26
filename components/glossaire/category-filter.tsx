import {
  FilterPills,
  type FilterOption,
} from "@/components/shared/filter-pills";
import { themes } from "@/data/themes";

export type ThemeFiltre = "tous" | string;

const options: FilterOption<ThemeFiltre>[] = [
  { value: "tous", label: "Toutes les catégories" },
  ...themes.map((theme) => ({ value: theme.slug, label: theme.titre })),
];

export interface CategoryFilterProps {
  value: ThemeFiltre;
  onChange: (value: ThemeFiltre) => void;
}

/** Filtre simulé « Catégorie » du glossaire : les cinq thèmes de la plateforme (voir `data/themes.ts`). */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Catégorie
      </span>
      <FilterPills
        label="Filtrer par catégorie"
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
