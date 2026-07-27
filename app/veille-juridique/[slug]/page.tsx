import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/ui/section";
import { Divider } from "@/components/ui/divider";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { AnalyseHeader } from "@/components/veille/analyse/analyse-header";
import { AnalysisSummary } from "@/components/veille/analyse/analysis-summary";
import { ChronologieSection } from "@/components/veille/analyse/chronologie-section";
import { LegalContext } from "@/components/veille/analyse/legal-context";
import { AnalyseSection } from "@/components/veille/analyse/analyse-section";
import { ImpactSection } from "@/components/veille/analyse/impact-section";
import { OfficialReferencesSection } from "@/components/veille/analyse/official-references-section";
import { RelatedAnalysesSection } from "@/components/veille/analyse/related-analyses-section";
import { RelatedLinksSection } from "@/components/shared/related-links-section";
import { AnalyseSidebar } from "@/components/veille/analyse/analyse-sidebar";
import { veilleItems } from "@/data/veille";
import {
  getVeilleBySlug,
  getRelatedVeille,
  getThemeForCategorie,
} from "@/lib/content";
import { labelDomaine } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { buildAnalyseMetadata, buildMetadata } from "@/lib/metadata";
import { buildArticleJsonLd } from "@/lib/json-ld";
import { getLiensConnexes } from "@/lib/internal-links";

interface AnalysePageProps {
  params: Promise<{ slug: string }>;
}

const SECTION_IDS = {
  resume: "a-retenir",
  faits: "les-faits",
  contexte: "contexte-juridique",
  analyse: "notre-analyse",
  impact: "pourquoi-important",
  references: "references-officielles",
  similaires: "analyses-similaires",
  plusLoin: "pour-aller-plus-loin",
} as const;

export function generateStaticParams() {
  return veilleItems.map((item) => ({ slug: item.slug }));
}

// Ensemble fermé d'analyses connu au build : un slug hors de cette liste doit
// être un vrai 404 HTTP, pas une page rendue à la demande. Même choix que
// app/comprendre/[slug]/page.tsx, pour la même raison (voir son historique :
// un not-found.tsx imbriqué avait produit un statut 200 au lieu de 404).
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: AnalysePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getVeilleBySlug(slug);

  if (!item) {
    return buildMetadata({
      title: "Analyse introuvable",
      description: "Cette analyse de veille juridique n'existe pas ou plus.",
      path: `/veille-juridique/${slug}`,
      noIndex: true,
    });
  }

  return buildAnalyseMetadata(item);
}

export default async function AnalysePage({ params }: AnalysePageProps) {
  const { slug } = await params;
  const item = getVeilleBySlug(slug);

  if (!item) {
    notFound();
  }

  const theme = getThemeForCategorie(item.categorie);
  const related = getRelatedVeille(item, 4);
  const liensConnexes = getLiensConnexes({
    categorie: item.categorie,
    domaine: item.domaine,
  });
  const url = `${siteConfig.url}/veille-juridique/${slug}`;
  const aUnImpact = Object.values(item.impact).some(
    (group) => (group?.length ?? 0) > 0,
  );

  const tocItems = [
    { id: SECTION_IDS.resume, label: "À retenir en 1 minute" },
    ...(item.chronologie.length > 0
      ? [{ id: SECTION_IDS.faits, label: "Les faits" }]
      : []),
    ...(item.contexteJuridique.length > 0
      ? [{ id: SECTION_IDS.contexte, label: "Le contexte juridique" }]
      : []),
    { id: SECTION_IDS.analyse, label: "Notre analyse" },
    ...(aUnImpact
      ? [{ id: SECTION_IDS.impact, label: "Pourquoi c'est important" }]
      : []),
    ...(item.referencesOfficielles.length > 0
      ? [{ id: SECTION_IDS.references, label: "Références officielles" }]
      : []),
    ...(related.length > 0
      ? [{ id: SECTION_IDS.similaires, label: "Analyses similaires" }]
      : []),
    ...(liensConnexes.length > 0
      ? [{ id: SECTION_IDS.plusLoin, label: "Pour aller plus loin" }]
      : []),
  ];

  const jsonLd = buildArticleJsonLd({
    headline: item.titre,
    description: item.resume,
    path: `/veille-juridique/${slug}`,
    datePublished: item.date,
    dateModified: item.dateMiseAJour,
    section: theme?.titre ?? labelDomaine(item.domaine),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div id="top" />

      <Section spacing="sm" className="border-border border-b">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Veille juridique", href: "/veille-juridique" },
            ...(theme
              ? [
                  {
                    label: theme.titre,
                    href: `/veille-juridique?domaine=${theme.slug}`,
                  },
                ]
              : []),
            { label: item.titre },
          ]}
        />
      </Section>

      <Section spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div id="analyse-article" className="min-w-0">
            <AnalyseHeader item={item} url={url} />

            <Divider className="my-10" />

            <div className="space-y-12">
              <AnalysisSummary
                id={SECTION_IDS.resume}
                points={item.pointsCles}
              />
              <ChronologieSection
                id={SECTION_IDS.faits}
                evenements={item.chronologie}
              />
              <LegalContext
                id={SECTION_IDS.contexte}
                references={item.contexteJuridique}
              />
              <AnalyseSection id={SECTION_IDS.analyse} blocks={item.analyse} />
              <ImpactSection id={SECTION_IDS.impact} impact={item.impact} />
              <OfficialReferencesSection
                id={SECTION_IDS.references}
                references={item.referencesOfficielles}
              />
              <RelatedAnalysesSection
                id={SECTION_IDS.similaires}
                items={related}
              />
              <RelatedLinksSection
                id={SECTION_IDS.plusLoin}
                items={liensConnexes}
              />
            </div>
          </div>

          <div className="lg:order-last">
            <AnalyseSidebar
              tocItems={tocItems}
              articleId="analyse-article"
              tempsLecture={item.tempsLecture}
              dateMiseAJour={item.dateMiseAJour}
              domaine={item.domaine}
              institution={item.source}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
