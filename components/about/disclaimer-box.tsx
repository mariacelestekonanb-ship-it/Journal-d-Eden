import { ShieldAlert } from "lucide-react";

import { Heading } from "@/components/ui/heading";

export interface DisclaimerBoxProps {
  title: string;
  items: string[];
}

/**
 * Encadré d'avertissement générique — reprend le ton visuel du bloc
 * « callout » d'avertissement (voir `components/shared/content-blocks.tsx`)
 * mais comme composant autonome, pour une section entière plutôt qu'un
 * paragraphe isolé dans un corps de texte.
 */
export function DisclaimerBox({ title, items }: DisclaimerBoxProps) {
  return (
    <div className="border-gold-300/60 bg-gold-100/60 flex gap-4 rounded-2xl border p-6 sm:p-8">
      <ShieldAlert
        aria-hidden
        className="text-gold-600 mt-0.5 size-6 shrink-0"
      />
      <div>
        <Heading as="h2" size="sm">
          {title}
        </Heading>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="text-foreground flex gap-2 text-sm leading-relaxed"
            >
              <span aria-hidden>—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
