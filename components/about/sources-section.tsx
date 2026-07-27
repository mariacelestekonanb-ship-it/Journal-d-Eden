import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { SourceCard } from "@/components/about/source-card";
import { institutions } from "@/data/institutions";

/** Section « Nos sources principales » : les institutions dont les textes et décisions nourrissent les contenus. */
export function SourcesSection() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          Nos sources principales
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Les institutions dont les textes, décisions et publications
          nourrissent les fiches et analyses de LexWatch.
        </Paragraph>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {institutions.map((institution) => (
          <SourceCard key={institution.sigle} {...institution} />
        ))}
      </div>
    </Section>
  );
}
