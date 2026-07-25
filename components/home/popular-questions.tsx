import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { QuestionPreviewCard } from "@/components/home/question-preview-card";
import { questions } from "@/data/questions";
import type { QuestionItem } from "@/types";

const featuredSlugs = [
  "qui-possede-l-espace",
  "responsabilite-collision-satellites",
  "licence-lancement-fusee",
  "quest-ce-que-rgpd",
  "ia-act-systemes-haut-risque",
  "obligation-notification-incident",
];

const featuredQuestions: QuestionItem[] = featuredSlugs
  .map((slug) => questions.find((question) => question.slug === slug))
  .filter((question): question is QuestionItem => question !== undefined);

/** Section « Questions populaires » : six questions fréquentes, tous domaines confondus. */
export function PopularQuestions() {
  return (
    <Section tone="muted">
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          Les questions les plus posées
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Des réponses claires aux interrogations les plus fréquentes sur le
          droit spatial et le droit du numérique.
        </Paragraph>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredQuestions.map((question) => (
          <QuestionPreviewCard key={question.slug} question={question} />
        ))}
      </div>
    </Section>
  );
}
