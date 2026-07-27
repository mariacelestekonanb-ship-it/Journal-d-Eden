import type { Metadata } from "next";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { AboutHero } from "@/components/about/about-hero";
import { MissionSection } from "@/components/about/mission-section";
import { ProjectSection } from "@/components/about/project-section";
import { AuthorSection } from "@/components/about/author-section";
import { WritingProcessSection } from "@/components/about/writing-process-section";
import { SourcesSection } from "@/components/about/sources-section";
import { DisclaimerBox } from "@/components/about/disclaimer-box";
import { AboutCta } from "@/components/about/about-cta";
import { buildMetadata } from "@/lib/metadata";
import { buildAboutPageJsonLd } from "@/lib/json-ld";

const TITLE = "À propos de LexWatch";
const DESCRIPTION =
  "LexWatch est une plateforme étudiante de vulgarisation consacrée au droit spatial et au droit du numérique : sa mission, le projet, l'auteure et la méthode de rédaction des contenus.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/a-propos",
});

const DISCLAIMER_ITEMS = [
  "LexWatch ne fournit pas de conseils juridiques personnalisés.",
  "Les contenus publiés sont informatifs et pédagogiques : ils vulgarisent le droit, ils ne s'y substituent pas.",
  "Pour toute situation précise, consultez les textes officiels ou un professionnel du droit.",
];

export default function AProposPage() {
  return (
    <>
      <JsonLd
        data={buildAboutPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/a-propos",
        })}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
      />

      <AboutHero />
      <MissionSection />
      <ProjectSection />
      <AuthorSection />
      <WritingProcessSection />
      <SourcesSection />

      <Section tone="muted">
        <Container size="narrow">
          <DisclaimerBox
            title="Ce que LexWatch n'est pas"
            items={DISCLAIMER_ITEMS}
          />
        </Container>
      </Section>

      <AboutCta />
    </>
  );
}
