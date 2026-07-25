import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { SearchSection } from "@/components/home/search-section";
import { PopularQuestions } from "@/components/home/popular-questions";
import { ThemeExplorer } from "@/components/home/theme-explorer";
import { LatestInsights } from "@/components/home/latest-insights";
import { CtaSection } from "@/components/home/cta-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accueil",
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchSection />
      <PopularQuestions />
      <ThemeExplorer />
      <LatestInsights />
      <CtaSection />
    </>
  );
}
