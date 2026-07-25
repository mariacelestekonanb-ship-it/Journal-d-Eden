import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { PrimaryActions } from "@/components/home/primary-actions";

/** Section d'appel à l'action de fin de page d'accueil. */
export function CtaSection() {
  return (
    <Section tone="navy" spacing="lg" className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-gold-500/15 pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <Heading as="h2" size="lg" className="text-white">
          Commencez votre exploration du droit spatial.
        </Heading>
        <PrimaryActions className="mt-8 justify-center" />
      </div>
    </Section>
  );
}
