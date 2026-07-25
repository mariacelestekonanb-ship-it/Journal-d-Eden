import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/page-header";
import { ComprendreExplorer } from "@/components/sections/comprendre-explorer";
import { questions } from "@/data/questions";

export const metadata: Metadata = {
  title: "Comprendre",
  description:
    "Les fondamentaux du droit spatial et du droit du numérique expliqués simplement : questions clés, réponses claires et niveaux de complexité.",
};

export default function ComprendrePage() {
  return (
    <>
      <PageHeader
        eyebrow="Comprendre"
        title="Les fondamentaux, sans jargon"
        description="Chaque notion clé du droit spatial et du droit du numérique expliquée en une question et une réponse claire, classée par niveau de complexité."
      />

      <section className="py-16 sm:py-20">
        <div className="container-lexwatch">
          <ComprendreExplorer questions={questions} />
        </div>
      </section>
    </>
  );
}
