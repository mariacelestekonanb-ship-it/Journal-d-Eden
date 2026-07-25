import { cn } from "@/lib/utils";
import type { FiltreDomaine } from "@/types";

const options: { value: FiltreDomaine; label: string }[] = [
  { value: "tous", label: "Tout" },
  { value: "droit-spatial", label: "Droit spatial" },
  { value: "droit-numerique", label: "Droit du numérique" },
];

interface DomaineFilterProps {
  value: FiltreDomaine;
  onChange: (value: FiltreDomaine) => void;
}

export function DomaineFilter({ value, onChange }: DomaineFilterProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-border bg-card p-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            value === option.value
              ? "bg-navy-900 text-white"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
