import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export interface ContextSectionProps {
  id: string;
  paragraphs: string[];
}

/** Bloc pédagogique « Pourquoi cette question se pose ? ». */
export function ContextSection({ id, paragraphs }: ContextSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Pourquoi cette question se pose ?
      </Heading>
      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <Paragraph key={index} tone="muted">
            {paragraph}
          </Paragraph>
        ))}
      </div>
    </section>
  );
}
