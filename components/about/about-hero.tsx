import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { HeroBackdrop } from "@/components/shared/hero-backdrop";

export interface AboutHeroProps {
  /** Image de fond déposée depuis /admin/reglages — fond bleu nuit uni tant qu'aucun fichier n'est renseigné. */
  backgroundImageUrl?: string;
}

/** Hero de la page « À propos » — sobre, sans animation d'entrée ni pleine hauteur d'écran : cette page informe, elle ne vend pas. */
export function AboutHero({ backgroundImageUrl }: AboutHeroProps) {
  return (
    <Section tone="navy" spacing="lg" className="relative overflow-hidden">
      <HeroBackdrop imageUrl={backgroundImageUrl} />

      <div className="relative max-w-2xl">
        <Heading as="h1" size="xl" className="text-white">
          À propos de LexWatch
        </Heading>
        <Paragraph
          tone="muted"
          size="lg"
          className="mt-6 max-w-xl text-gray-300"
        >
          Une plateforme étudiante de vulgarisation consacrée au droit spatial
          et au droit du numérique.
        </Paragraph>
      </div>
    </Section>
  );
}
