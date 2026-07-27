import { Rocket, Cpu, Bot, Radio, Landmark } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { ThemeCard, type ThemeCardProps } from "@/components/home/theme-card";

const themes: ThemeCardProps[] = [
  {
    icon: Rocket,
    title: "Droit spatial",
    description:
      "Traités internationaux, exploitation des ressources et régulation des lancements.",
    href: "/veille-juridique?domaine=droit-spatial",
  },
  {
    icon: Cpu,
    title: "Droit du numérique",
    description:
      "Protection des données, plateformes en ligne et cybersécurité.",
    href: "/veille-juridique?domaine=droit-numerique",
  },
  {
    icon: Bot,
    title: "Intelligence artificielle",
    description:
      "Classification des risques, gouvernance algorithmique et responsabilité.",
    href: "/veille-juridique?domaine=intelligence-artificielle",
  },
  {
    icon: Radio,
    title: "Télécommunications",
    description:
      "Fréquences, satellites de communication et régulation des réseaux.",
    href: "/veille-juridique?domaine=telecommunications",
  },
  {
    icon: Landmark,
    title: "Institutions",
    description:
      "ONU, agences spatiales et autorités de régulation qui font la norme.",
    href: "/veille-juridique?domaine=institutions",
  },
];

/** Section « Explorer par thème » : cinq grandes entrées thématiques de la plateforme. */
export function ThemeExplorer() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          Explorer par thème
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Cinq grandes entrées pour naviguer dans le droit spatial et le droit
          du numérique.
        </Paragraph>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <ThemeCard key={theme.title} {...theme} />
        ))}
      </div>
    </Section>
  );
}
