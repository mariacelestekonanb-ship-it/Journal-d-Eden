import { BookOpen, GraduationCap, Lightbulb, Users } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { MissionCard } from "@/components/about/mission-card";

const PILIERS = [
  {
    icon: BookOpen,
    title: "Rendre le droit accessible",
    description:
      "Traduire le droit spatial et le droit du numérique dans un langage clair, sans jamais trahir la rigueur des textes.",
  },
  {
    icon: GraduationCap,
    title: "Des contenus pédagogiques",
    description:
      "Chaque fiche et chaque analyse est pensée pour être comprise sans formation juridique préalable.",
  },
  {
    icon: Lightbulb,
    title: "Encourager la curiosité",
    description:
      "Donner envie d'aller plus loin sur des sujets encore peu couverts, à la frontière du droit et de la technologie.",
  },
  {
    icon: Users,
    title: "Une culture juridique partagée",
    description:
      "Contribuer, à son échelle, à une meilleure compréhension collective des règles qui encadrent l'espace et le numérique.",
  },
];

/** Section « La mission » : les quatre facettes de la raison d'être de LexWatch. */
export function MissionSection() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          Notre mission
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          LexWatch existe pour une raison simple : le droit spatial et le droit
          du numérique façonnent déjà notre quotidien, mais restent largement
          inaccessibles à qui n&apos;est pas juriste.
        </Paragraph>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILIERS.map((pilier) => (
          <MissionCard key={pilier.title} {...pilier} />
        ))}
      </div>
    </Section>
  );
}
