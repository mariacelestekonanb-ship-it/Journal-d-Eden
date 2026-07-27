import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Container } from "@/components/ui/container";
import { AuthorCard } from "@/components/about/author-card";
import { authorConfig } from "@/lib/author-config";

/** Section « À propos de l'auteure » : présentation courte, construite entièrement depuis `lib/author-config.ts`. */
export function AuthorSection() {
  return (
    <Section>
      <Container size="narrow" className="mb-10 text-center">
        <Badge variant="accent" className="mb-4">
          L&apos;auteure
        </Badge>
        <Heading as="h2" size="lg">
          Derrière LexWatch
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Un projet porté par une seule personne — la transparence sur qui écrit
          fait partie de la confiance que LexWatch cherche à construire.
        </Paragraph>
      </Container>

      <div className="mx-auto max-w-3xl">
        <AuthorCard {...authorConfig} />
      </div>
    </Section>
  );
}
