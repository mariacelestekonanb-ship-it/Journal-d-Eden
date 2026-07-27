import type { Metadata } from "next";

import { ComprendreHero } from "@/components/comprendre/hero";
import { SearchExperience } from "@/components/shared/search-experience";
import { CategoriesSection } from "@/components/comprendre/categories-section";
import { PopularQuestionsSection } from "@/components/comprendre/popular-questions-section";
import { AllFichesExplorer } from "@/components/comprendre/all-fiches-explorer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { questions } from "@/data/questions";
import { buildMetadata } from "@/lib/metadata";
import { buildCollectionPageJsonLd, buildFaqPageJsonLd } from "@/lib/json-ld";

const TITLE = "Comprendre";
const DESCRIPTION =
  "Des fiches pédagogiques pour expliquer les notions essentielles du droit spatial et du droit du numérique.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/comprendre",
});

interface ComprendrePageProps {
  searchParams: Promise<{ theme?: string; q?: string }>;
}

/**
 * Page Comprendre : bibliothèque pédagogique de LexWatch. `theme` et `q`
 * sont lus côté serveur pour pré-filtrer/pré-remplir la page sans
 * JavaScript — exactement le point d'intégration qu'utilisera un futur
 * appel à une base de données (voir `AllFichesExplorer`).
 */
export default async function ComprendrePage({
  searchParams,
}: ComprendrePageProps) {
  const { theme, q } = await searchParams;

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/comprendre",
          }),
          buildFaqPageJsonLd(
            questions.map((question) => ({
              question: question.question,
              reponse: question.reponseCourte,
            })),
          ),
        ]}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "Comprendre" }]}
      />
      <ComprendreHero />
      <SearchExperience
        items={questions.map((item) => ({
          key: item.slug,
          label: item.question,
          href: `/comprendre/${item.slug}`,
        }))}
        placeholder="Rechercher une notion, une question ou un sujet…"
        panelId="comprendre-search-panel"
        recentSearches={["RGPD", "satellites", "AI Act"]}
        initialQuery={q}
        resultLabel="fiche"
      />
      <CategoriesSection activeTheme={theme} />
      <PopularQuestionsSection />
      <AllFichesExplorer initialTheme={theme} />
    </>
  );
}
