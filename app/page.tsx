import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { SearchSection } from "@/components/home/search-section";
import { PopularQuestions } from "@/components/home/popular-questions";
import { ThemeExplorer } from "@/components/home/theme-explorer";
import { LatestInsights } from "@/components/home/latest-insights";
import { CtaSection } from "@/components/home/cta-section";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";
import { siteSettingsStore } from "@/lib/admin/repository";

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: "/",
  }),
  // La page d'accueil porte le titre complet du site plutôt que le gabarit
  // « Accueil | LexWatch » : `absolute` court-circuite le `title.template`
  // du layout racine pour ce seul cas.
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
};

export default async function HomePage() {
  const settings = await siteSettingsStore.get();

  return (
    <>
      <Hero
        headline={settings.hero.headline}
        description={settings.hero.description}
        ctaPrimaryLabel={settings.hero.ctaPrimaryLabel}
        ctaSecondaireLabel={settings.hero.ctaSecondaireLabel}
        media={settings.hero.media}
      />
      <SearchSection />
      <PopularQuestions />
      <ThemeExplorer />
      <LatestInsights />
      <CtaSection />
    </>
  );
}
