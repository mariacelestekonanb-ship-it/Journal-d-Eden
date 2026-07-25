import { Tag } from "@/components/ui/tag";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

export interface FilterPillsProps<T extends string> {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Groupe de filtres à sélection unique, construit sur `<Tag asButton>` —
 * le design system prévoit déjà ce composant pour un usage de filtre.
 * Générique : réutilisé pour le thème, le niveau et le tri.
 */
export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <Tag
          key={option.value}
          asButton
          active={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Tag>
      ))}
    </div>
  );
}
