import { Lightbulb } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export interface QuickAnswerProps {
  id?: string;
  text: string;
}

/**
 * Bloc « En bref » : la réponse que le visiteur doit retenir même s'il ne
 * lit rien d'autre. Fond légèrement teinté (accent doré très discret),
 * texte plafonné à 5 lignes.
 */
export function QuickAnswer({ id, text }: QuickAnswerProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="bg-accent/10 border-accent/20 flex scroll-mt-28 gap-4 rounded-xl border p-6 sm:p-8"
    >
      <span
        aria-hidden
        className="bg-accent text-accent-foreground flex size-10 shrink-0 items-center justify-center rounded-full"
      >
        <Lightbulb className="size-5" />
      </span>
      <div>
        <Heading id={headingId} as="h2" size="xs">
          En bref
        </Heading>
        <Paragraph className="mt-2 line-clamp-5 text-balance">{text}</Paragraph>
      </div>
    </section>
  );
}
