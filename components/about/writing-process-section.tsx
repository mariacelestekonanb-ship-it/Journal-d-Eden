import {
  Scale,
  Gavel,
  ShieldCheck,
  PenLine,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

interface Etape {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ETAPES: Etape[] = [
  {
    icon: Scale,
    title: "Consultation des textes officiels",
    description:
      "Traités, règlements, lois et directives sont lus directement à la source, jamais par ouï-dire.",
  },
  {
    icon: Gavel,
    title: "Consultation des décisions",
    description:
      "La jurisprudence pertinente est examinée pour comprendre comment les textes sont réellement appliqués.",
  },
  {
    icon: ShieldCheck,
    title: "Vérification des sources",
    description:
      "Chaque affirmation s'appuie sur une source identifiable, citée en référence de la fiche ou de l'analyse.",
  },
  {
    icon: PenLine,
    title: "Rédaction pédagogique",
    description:
      "Le contenu est ensuite reformulé dans un langage clair, sans perdre la précision juridique du texte d'origine.",
  },
  {
    icon: RefreshCw,
    title: "Mise à jour lorsque nécessaire",
    description:
      "Un contenu est révisé dès qu'un texte évolue ou qu'une décision vient préciser son interprétation.",
  },
];

/** Section « Comment les contenus sont rédigés » : la méthode, étape par étape. */
export function WritingProcessSection() {
  return (
    <Section tone="muted">
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          Comment les contenus sont rédigés
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Une même méthode, appliquée à chaque fiche et à chaque analyse.
        </Paragraph>
      </div>

      <ol className="mx-auto mt-12 max-w-3xl space-y-8">
        {ETAPES.map((etape, index) => (
          <li key={etape.title} className="flex gap-5">
            <span
              aria-hidden
              className="bg-navy-900 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            >
              {index + 1}
            </span>
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <etape.icon
                  className="text-accent size-4.5 shrink-0"
                  aria-hidden
                />
                <Heading as="h3" size="xs">
                  {etape.title}
                </Heading>
              </div>
              <Paragraph tone="muted" size="sm" className="mt-1.5">
                {etape.description}
              </Paragraph>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
