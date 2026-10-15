"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { HeroBackdrop } from "@/components/shared/hero-backdrop";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export interface GlossaireHeroProps {
  /** Image de fond déposée depuis /admin/reglages — fond bleu nuit uni tant qu'aucun fichier n'est renseigné. */
  backgroundImageUrl?: string;
}

/**
 * Hero du Glossaire, sur un fond bleu nuit uni ou une image déposée depuis
 * `/admin/reglages` (voir `HeroBackdrop`).
 */
export function GlossaireHero({ backgroundImageUrl }: GlossaireHeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Section tone="navy" spacing="lg" className="relative overflow-hidden">
      <HeroBackdrop imageUrl={backgroundImageUrl} />

      <div className="relative max-w-2xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={transition}
        >
          <Heading as="h1" size="xl" className="text-white">
            Glossaire juridique
          </Heading>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{
            ...transition,
            delay: prefersReducedMotion ? 0 : 0.1,
          }}
        >
          <Paragraph
            tone="muted"
            size="lg"
            className="mt-6 max-w-xl text-gray-300"
          >
            Comprenez rapidement les principaux termes du droit spatial et du
            droit du numérique grâce à des définitions claires et accessibles.
          </Paragraph>
        </motion.div>
      </div>
    </Section>
  );
}
