import type { Metadata } from "next";

import { VeilleHero } from "@/components/veille/hero";
import { SearchExperience } from "@/components/shared/search-experience";
import { Section } from "@/components/ui/section";
import { RecentAnalysesExplorer } from "@/components/veille/recent-analyses-explorer";
import { FeaturedAnalysesSection } from "@/components/veille/featured-analyses-section";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { veilleItems } from "@/data/veille";
import { getVeilleALaUne } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { buildCollectionPageJsonLd } from "@/lib/json-ld";

const TITLE = "Veille juridique";
const DESCRIPTION =
  "Suivez les évolutions du droit spatial et du droit du numérique grâce à des analyses pédagogiques et rigoureuses.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/veille-juridique",
});

interface VeilleJuridiquePageProps {
  searchParams: Promise<{ domaine?: string; q?: string }>;
}

/**
 * Page Veille juridique : plateforme d'analyse, pas un fil d'actualités.
 * `domaine` et `q` sont lus côté serveur pour pré-filtrer/pré-remplir la
 * page sans JavaScript — même principe que la page Comprendre.
 */
export default async function VeilleJuridiquePage({
  searchParams,
}: VeilleJuridiquePageProps) {
  const { domaine, q } = await searchParams;
  const featured = getVeilleALaUne().slice(0, 3);

  return (
    <>
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/veille-juridique",
        })}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "Veille juridique" }]}
      />
      <VeilleHero />

      <SearchExperience
        items={veilleItems.map((item) => ({
          key: item.slug,
          label: item.titre,
          href: `/veille-juridique/${item.slug}`,
        }))}
        placeholder="Rechercher une analyse, une institution, un sujet…"
        panelId="veille-search-panel"
        recentSearches={["AI Act", "CNIL", "Artemis"]}
        initialQuery={q}
        resultLabel="analyse"
      />

      <Section>
        <RecentAnalysesExplorer initialDomaine={domaine} />
      </Section>

      <Section tone="muted">
        <FeaturedAnalysesSection items={featured} />
      </Section>
    </>
  );
}
