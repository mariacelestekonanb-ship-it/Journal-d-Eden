import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { AboutHeroIllustration } from "@/components/about/about-hero-illustration";

/** Hero de la page « À propos » — sobre, sans animation d'entrée ni pleine hauteur d'écran : cette page informe, elle ne vend pas. */
export function AboutHero() {
  return (
    <Section tone="navy" spacing="lg" className="relative overflow-hidden">
      <div className="bg-grid-navy absolute inset-0 opacity-30" aria-hidden />

      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
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

        <div className="mx-auto hidden w-full max-w-md md:block lg:max-w-lg">
          <AboutHeroIllustration />
        </div>
      </div>
    </Section>
  );
}
