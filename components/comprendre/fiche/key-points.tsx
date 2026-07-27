import { CheckCircle2 } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export interface KeyPointsProps {
  id?: string;
  points: string[];
}

/**
 * « À retenir » : 3 à 5 points essentiels. Composant autonome et
 * réutilisable — inclut son propre titre, à la différence de
 * `ExplicationBlocks` qui n'est qu'un fragment de contenu.
 */
export function KeyPoints({ id, points }: KeyPointsProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="border-border bg-card scroll-mt-28 rounded-xl border p-6 sm:p-8"
    >
      <Heading id={headingId} as="h2" size="md">
        À retenir
      </Heading>
      <ul className="mt-5 space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden
              className="text-accent mt-0.5 size-5 shrink-0"
            />
            <Paragraph className="text-foreground">{point}</Paragraph>
          </li>
        ))}
      </ul>
    </section>
  );
}
