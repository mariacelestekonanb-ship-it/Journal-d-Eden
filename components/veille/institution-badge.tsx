import { Landmark } from "lucide-react";

export interface InstitutionBadgeProps {
  institution: string;
}

/** Organisme source d'une analyse (ex. « Commission européenne », « CNIL »). */
export function InstitutionBadge({ institution }: InstitutionBadgeProps) {
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs font-medium">
      <Landmark className="size-3.5" aria-hidden />
      {institution}
    </span>
  );
}
