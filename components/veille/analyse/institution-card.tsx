import { Landmark } from "lucide-react";

export interface InstitutionCardProps {
  institution: string;
}

/**
 * Carte compacte présentant l'institution source d'une analyse, utilisée
 * dans la barre latérale — plus visible qu'un simple `InstitutionBadge`
 * inline utilisé dans l'en-tête et les cartes de liste.
 */
export function InstitutionCard({ institution }: InstitutionCardProps) {
  return (
    <div className="border-border bg-muted/40 flex items-center gap-3 rounded-xl border p-3">
      <span
        aria-hidden
        className="bg-navy-900 flex size-9 shrink-0 items-center justify-center rounded-full text-white"
      >
        <Landmark className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Institution
        </p>
        <p className="text-foreground truncate text-sm font-semibold">
          {institution}
        </p>
      </div>
    </div>
  );
}
