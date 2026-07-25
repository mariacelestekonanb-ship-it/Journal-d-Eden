"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { PrimaryActions } from "@/components/home/primary-actions";
import { OrbitalIllustration } from "@/components/home/orbital-illustration";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Hero de la page d'accueil : promesse de la plateforme à gauche,
 * illustration orbitale abstraite à droite. Occupe environ 80% de la
 * hauteur d'écran. Les animations d'entrée respectent
 * `prefers-reduced-motion`.
 */
export function Hero() {
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
      <div className="bg-grid-navy absolute inset-0 opacity-40" aria-hidden />

      <div className="relative grid w-full items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={transition}
          >
            <Heading as="h1" size="xl" className="text-white">
              Le droit spatial et le droit du numérique accessibles à tous.
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
              Comprendre simplement les règles qui encadrent l&apos;espace et
              les technologies numériques grâce à des fiches pédagogiques et une
              veille juridique.
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
            <PrimaryActions />
          </motion.div>
        </div>

        <motion.div
          initial={
            prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.25 }}
          className="mx-auto hidden w-full max-w-md md:block lg:max-w-lg"
        >
          <OrbitalIllustration />
        </motion.div>
      </div>
    </Section>
  );
}
