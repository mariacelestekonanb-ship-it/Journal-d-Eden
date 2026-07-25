import { Clock } from "lucide-react";

export interface ReadingTimeProps {
  minutes: number;
}

/** Temps de lecture estimé, affiché de façon cohérente sur toutes les analyses. */
export function ReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
      <Clock className="size-3.5" aria-hidden />
      {minutes} min de lecture
    </span>
  );
}
