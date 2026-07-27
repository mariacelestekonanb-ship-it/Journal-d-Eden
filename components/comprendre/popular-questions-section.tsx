import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { QuestionSummaryCard } from "@/components/comprendre/question-summary-card";
import { questions } from "@/data/questions";

export const MAX_QUESTIONS = 9;

/** Section « Questions populaires » : un aperçu borné (9 au maximum), pas l'intégralité de la bibliothèque. */
export function PopularQuestionsSection() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          Questions populaires
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Les interrogations les plus fréquentes, avec une réponse claire et le
          temps de lecture estimé.
        </Paragraph>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {questions.slice(0, MAX_QUESTIONS).map((item) => (
          <QuestionSummaryCard key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  );
}
