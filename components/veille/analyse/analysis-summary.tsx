import { Timer, CheckCircle2 } from "lucide-react";

import { Heading } from "@/components/ui/heading";

export interface AnalysisSummaryProps {
  id?: string;
  points: string[];
}

/**
 * « À retenir en 1 minute » : encadré très visible, pensé pour un lecteur
 * pressé. Fond bleu nuit plein plutôt qu'une simple teinte, pour trancher
 * nettement avec le reste de la page — distinct de `KeyPoints` (« À
 * retenir » d'une fiche pédagogique), volontairement plus sobre.
 */
export function AnalysisSummary({ id, points }: AnalysisSummaryProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="bg-navy-950 scroll-mt-28 rounded-xl p-6 text-white sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="bg-accent text-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-full"
        >
          <Timer className="size-4.5" />
        </span>
        <Heading id={headingId} as="h2" size="xs" className="text-white">
          À retenir en 1 minute
        </Heading>
      </div>
      <ul className="mt-5 space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden
              className="text-accent mt-0.5 size-5 shrink-0"
            />
            <p className="text-white/90">{point}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
