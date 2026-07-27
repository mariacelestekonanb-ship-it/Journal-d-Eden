import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/shared/timeline";
import type { EvenementChronologie } from "@/types";

const ETAPES: EvenementChronologie[] = [
  {
    date: "2026-01-01",
    titre: "Un projet personnel",
    description:
      "LexWatch naît d'un intérêt pour deux domaines du droit encore peu vulgarisés : l'espace et le numérique.",
  },
  {
    date: "2026-07-01",
    titre: "Un espace de veille et de vulgarisation",
    description:
      "Fiches pédagogiques, veille juridique et glossaire prennent forme, avec une exigence constante de clarté et de rigueur.",
  },
  {
    date: "2026-12-31",
    titre: "La suite",
    description:
      "De nouveaux formats et de nouveaux sujets viendront progressivement enrichir la plateforme, au rythme d'un projet étudiant.",
  },
];

/** Section « Le projet » : LexWatch situé comme projet personnel et étudiant, pas comme média institutionnel. */
export function ProjectSection() {
  return (
    <Section tone="muted">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Badge variant="accent" className="mb-4">
            Le projet
          </Badge>
          <Heading as="h2" size="lg">
            Un projet étudiant, assumé comme tel
          </Heading>
          <Paragraph tone="muted" size="lg" className="mt-5">
            LexWatch est un projet personnel : un blog étudiant construit comme
            un espace de veille juridique et de vulgarisation, pas comme la
            publication d&apos;un cabinet ou d&apos;une institution.
          </Paragraph>
          <Paragraph tone="muted" className="mt-4">
            Cette transparence est volontaire. Elle permet d&apos;aborder des
            sujets pointus avec curiosité, sans prétendre à une autorité
            qu&apos;un seul projet étudiant ne saurait avoir — tout en
            maintenant une exigence de rigueur sur chaque contenu publié.
          </Paragraph>
          <Paragraph tone="muted" className="mt-4">
            LexWatch évoluera progressivement : de nouvelles fiches, de
            nouvelles analyses et de nouveaux formats viendront enrichir la
            plateforme au fil du temps.
          </Paragraph>
        </div>

        <div>
          <Timeline evenements={ETAPES} />
        </div>
      </div>
    </Section>
  );
}
