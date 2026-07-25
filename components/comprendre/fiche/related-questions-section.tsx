import { Heading } from "@/components/ui/heading";
import { RelatedQuestionCard } from "@/components/comprendre/fiche/related-question-card";
import type { QuestionItem } from "@/types";

export interface RelatedQuestionsSectionProps {
  id: string;
  items: QuestionItem[];
}

/** « Questions associées » : fiches similaires pour poursuivre la lecture. */
export function RelatedQuestionsSection({
  id,
  items,
}: RelatedQuestionsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Questions associées
      </Heading>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <RelatedQuestionCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
