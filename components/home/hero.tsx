"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { PrimaryActions } from "@/components/home/primary-actions";
import { HeroBackdrop } from "@/components/shared/hero-backdrop";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export interface HeroProps {
  headline?: string;
  description?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaireLabel?: string;
  /** Image de fond déposée depuis /admin/reglages — fond bleu nuit uni tant qu'aucun fichier n'est renseigné. */
  backgroundImageUrl?: string;
}

/**
 * Hero de la page d'accueil : promesse de la plateforme, sur un fond bleu
 * nuit uni ou une image déposée depuis `/admin/reglages` (voir
 * `HeroBackdrop`). Occupe environ 80% de la hauteur d'écran. Les
 * animations d'entrée respectent `prefers-reduced-motion`.
 */
export function Hero({
  headline = "Le droit spatial et le droit du numérique accessibles à tous.",
  description = "Comprendre simplement les règles qui encadrent l'espace et les technologies numériques grâce à des fiches pédagogiques et une veille juridique.",
  ctaPrimaryLabel,
  ctaSecondaireLabel,
  backgroundImageUrl,
}: HeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Section
      tone="navy"
      spacing="none"
      className="relative flex min-h-[80vh] items-center overflow-hidden py-20"
    >
      <HeroBackdrop imageUrl={backgroundImageUrl} />

      <div className="relative max-w-2xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={transition}
        >
          <Heading as="h1" size="xl" className="text-white">
            {headline}
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
            {description}
          </Paragraph>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{
            ...transition,
            delay: prefersReducedMotion ? 0 : 0.2,
          }}
          className="mt-10"
        >
          <PrimaryActions
            primaryLabel={ctaPrimaryLabel}
            secondaryLabel={ctaSecondaireLabel}
          />
        </motion.div>
      </div>
    </Section>
  );
}
