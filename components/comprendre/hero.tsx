"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { OrbitalIllustration } from "@/components/home/orbital-illustration";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Hero de la page Comprendre : promesse pédagogique à gauche, illustration
 * orbitale à droite. Réutilise `OrbitalIllustration` de l'accueil pour une
 * direction artistique cohérente entre les deux Hero du site.
 */
export function ComprendreHero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Section tone="navy" spacing="lg" className="relative overflow-hidden">
      <div className="bg-grid-navy absolute inset-0 opacity-40" aria-hidden />

      <div className="relative grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={transition}
          >
            <Heading as="h1" size="xl" className="text-white">
              Comprendre le droit simplement.
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
              Des fiches pédagogiques pour expliquer les notions essentielles du
              droit spatial et du droit du numérique.
            </Paragraph>
          </motion.div>
        </div>

        <motion.div
          initial={
            prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.2 }}
          className="mx-auto hidden w-full max-w-sm md:block lg:max-w-md"
        >
          <OrbitalIllustration />
        </motion.div>
      </div>
    </Section>
  );
}
