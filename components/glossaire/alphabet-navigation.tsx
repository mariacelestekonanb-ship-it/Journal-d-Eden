import { cn } from "@/lib/utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface AlphabetNavigationProps {
  /** Lettres pour lesquelles au moins un terme existe, compte tenu des autres filtres actifs. */
  lettresDisponibles: string[];
  lettreActive: string | null;
  onSelect: (lettre: string | null) => void;
}

/**
 * Barre de navigation alphabétique : chaque lettre filtre la liste des
 * définitions. Une lettre sans terme reste affichée mais désactivée
 * (« lettre vide »), pour donner une vue honnête de la couverture du
 * glossaire plutôt que de la masquer.
 */
export function AlphabetNavigation({
  lettresDisponibles,
  lettreActive,
  onSelect,
}: AlphabetNavigationProps) {
  return (
    <nav aria-label="Navigation alphabétique">
      <ul className="flex flex-wrap gap-1.5">
        {ALPHABET.map((lettre) => {
          const disponible = lettresDisponibles.includes(lettre);
          const active = lettreActive === lettre;

          return (
            <li key={lettre}>
              <button
                type="button"
                disabled={!disponible}
                aria-current={active ? "true" : undefined}
                aria-label={
                  disponible
                    ? `Termes commençant par ${lettre}`
                    : `Aucun terme commençant par ${lettre}`
                }
                onClick={() => onSelect(active ? null : lettre)}
                className={cn(
                  "focus-visible:ring-ring flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  !disponible && "text-muted-foreground/40 cursor-not-allowed",
                  disponible && !active && "text-foreground hover:bg-secondary",
                  active && "bg-navy-900 text-white",
                )}
              >
                {lettre}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
