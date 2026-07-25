import { Paragraph } from "@/components/ui/paragraph";

export interface SummaryBoxProps {
  text: string;
}

/**
 * Résumé neutre affiché sous le titre, dans l'en-tête de fiche — distinct
 * de `QuickAnswer` (section « En bref ») qui porte, elle, l'accent visuel
 * fort. Limité à 3 lignes visuellement (`line-clamp-3`).
 */
export function SummaryBox({ text }: SummaryBoxProps) {
  return (
    <Paragraph
      size="lg"
      tone="muted"
      className="line-clamp-3 max-w-2xl text-balance"
    >
      {text}
    </Paragraph>
  );
}
