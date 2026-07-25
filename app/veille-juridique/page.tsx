import type { Metadata } from "next";

import { VeilleHero } from "@/components/veille/hero";
import { SearchExperience } from "@/components/shared/search-experience";
import { Section } from "@/components/ui/section";
import { RecentAnalysesExplorer } from "@/components/veille/recent-analyses-explorer";
import { FeaturedAnalysesSection } from "@/components/veille/featured-analyses-section";
import { veilleItems } from "@/data/veille";
import { getVeilleALaUne } from "@/lib/content";

export const metadata: Metadata = {
  title: "Veille juridique",
  description:
    "Suivez les évolutions du droit spatial et du droit du numérique grâce à des analyses pédagogiques et rigoureuses.",
};

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
