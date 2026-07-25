import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/ui/section";
import { Divider } from "@/components/ui/divider";
import { Breadcrumb } from "@/components/comprendre/fiche/breadcrumb";
import { FicheHeader } from "@/components/comprendre/fiche/fiche-header";
import { QuickAnswer } from "@/components/comprendre/fiche/quick-answer";
import { ContextSection } from "@/components/comprendre/fiche/context-section";
import { LegalBasisSection } from "@/components/comprendre/fiche/legal-basis-section";
import { ExplicationSection } from "@/components/comprendre/fiche/explication-section";
import { KeyPoints } from "@/components/comprendre/fiche/key-points";
import { ReferencesSection } from "@/components/comprendre/fiche/references-section";
import { RelatedQuestionsSection } from "@/components/comprendre/fiche/related-questions-section";
import { FicheSidebar } from "@/components/comprendre/fiche/fiche-sidebar";
import { questions } from "@/data/questions";
import {
  getQuestionBySlug,
  getRelatedQuestions,
  getThemeForCategorie,
} from "@/lib/content";
import { labelDomaine } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

interface FichePageProps {
  params: Promise<{ slug: string }>;
}

const SECTION_IDS = {
  enBref: "en-bref",
  contexte: "pourquoi-cette-question",
  droit: "ce-que-dit-le-droit",
  explication: "notre-explication",
  aRetenir: "a-retenir",
  references: "references",
  associees: "questions-associees",
} as const;

export function generateStaticParams() {
  return questions.map((question) => ({ slug: question.slug }));
}

// Ensemble fermé de fiches connu au build : un slug hors de cette liste doit
// être un vrai 404 HTTP, pas une page rendue à la demande. À repasser à
// `true` (comportement par défaut) le jour où les fiches viendront d'un
// backend pouvant en ajouter de nouvelles sans reconstruire le site.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: FichePageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);

  if (!question) {
    return { title: "Fiche introuvable" };
  }

  const url = `${siteConfig.url}/comprendre/${slug}`;

  return {
    title: question.question,
    description: question.reponseCourte,
    alternates: { canonical: `/comprendre/${slug}` },
    openGraph: {
      type: "article",
      title: question.question,
      description: question.reponseCourte,
      url,
      modifiedTime: question.dateMiseAJour,
      authors: [siteConfig.name],
      section: labelDomaine(question.domaine),
    },
    twitter: {
      card: "summary_large_image",
      title: question.question,
      description: question.reponseCourte,
    },
  };
}

export default async function FichePage({ params }: FichePageProps) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  const theme = getThemeForCategorie(question.categorie);
  const related = getRelatedQuestions(question, 4);
  const url = `${siteConfig.url}/comprendre/${slug}`;

  const tocItems = [
    { id: SECTION_IDS.enBref, label: "En bref" },
    { id: SECTION_IDS.contexte, label: "Pourquoi cette question ?" },
    { id: SECTION_IDS.droit, label: "Ce que dit le droit" },
    { id: SECTION_IDS.explication, label: "Notre explication" },
    { id: SECTION_IDS.aRetenir, label: "À retenir" },
    { id: SECTION_IDS.references, label: "Références" },
    ...(related.length > 0
      ? [{ id: SECTION_IDS.associees, label: "Questions associées" }]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    headline: question.question,
    name: question.question,
    description: question.reponseCourte,
    learningResourceType: "Fiche pédagogique",
    educationalLevel: question.niveau,
    dateModified: question.dateMiseAJour,
    inLanguage: "fr",
    about: labelDomaine(question.domaine),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url,
  };

  return (
    <>
      {/* JSON-LD généré côté serveur à partir de données internes, non de contenu utilisateur. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div id="top" />

      <Section spacing="sm" className="border-border border-b">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Comprendre", href: "/comprendre" },
            ...(theme
              ? [
                  {
                    label: theme.titre,
                    href: `/comprendre?theme=${theme.slug}`,
                  },
                ]
              : []),
            { label: question.question },
          ]}
        />
      </Section>

      <Section spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div id="fiche-article" className="min-w-0">
            <FicheHeader question={question} theme={theme} url={url} />

            <Divider className="my-10" />

            <div className="space-y-12">
              <QuickAnswer
                id={SECTION_IDS.enBref}
                text={question.reponseCourte}
              />
              <ContextSection
                id={SECTION_IDS.contexte}
                paragraphs={question.contexte}
              />
              <LegalBasisSection
                id={SECTION_IDS.droit}
                references={question.references}
              />
              <ExplicationSection
                id={SECTION_IDS.explication}
                blocks={question.explication}
              />
              <KeyPoints
                id={SECTION_IDS.aRetenir}
                points={question.pointsCles}
              />
              <ReferencesSection
                id={SECTION_IDS.references}
                references={question.references}
              />
              <RelatedQuestionsSection
                id={SECTION_IDS.associees}
                items={related}
              />
            </div>
          </div>

          <div className="lg:order-last">
            <FicheSidebar
              tocItems={tocItems}
              articleId="fiche-article"
              tempsLecture={question.tempsLecture}
              dateMiseAJour={question.dateMiseAJour}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
