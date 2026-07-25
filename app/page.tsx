import type { Metadata } from "next";
import { Layers, Radar, HelpCircle } from "lucide-react";

import { Hero } from "@/components/home/hero";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/ui/empty-state";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accueil",
  description: siteConfig.description,
};

const upcomingSections = [
  {
    icon: Layers,
    title: "Catégories clés",
    description:
      "Les grandes thématiques du droit spatial et du droit du numérique, présentées sous forme de cartes.",
  },
  {
    icon: Radar,
    title: "Veille récente",
    description:
      "Les dernières actualités juridiques suivies par la rédaction, mises à jour en continu.",
  },
  {
    icon: HelpCircle,
    title: "Comprendre l'essentiel",
    description:
      "Une sélection de questions fréquentes pour découvrir les fondamentaux du droit spatial et du numérique.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {upcomingSections.map((item, index) => (
        <Section key={item.title} tone={index % 2 === 1 ? "muted" : "default"}>
          <Heading as="h2" size="lg" className="text-center">
            {item.title}
          </Heading>
          <Divider className="mx-auto mt-8 max-w-xs" />
          <EmptyState
            icon={item.icon}
            title="Contenu à venir"
            description={item.description}
            className="mt-10"
          />
        </Section>
      ))}
    </>
  );
}
