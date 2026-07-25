import Link from "next/link";
import { Compass } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section spacing="lg">
      <div className="flex flex-col items-center text-center">
        <span className="bg-navy-900 text-accent flex size-16 items-center justify-center rounded-full">
          <Compass className="size-7" aria-hidden />
        </span>
        <Heading as="h1" size="lg" className="mt-8">
          Page introuvable
        </Heading>
        <Paragraph tone="muted" className="mt-4 max-w-md">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </Paragraph>
        <Button asChild variant="accent" size="lg" className="mt-8">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </Section>
  );
}
