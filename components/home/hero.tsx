"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Hero de la page d'accueil. Les animations d'entrée respectent
 * `prefers-reduced-motion` : elles sont désactivées côté utilisateurs qui
 * ont demandé une expérience sans mouvement.
 */
export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Section tone="navy" spacing="lg" className="relative overflow-hidden">
      <div className="bg-grid-navy absolute inset-0 opacity-40" aria-hidden />
      <div
        className="bg-gold-500/20 pointer-events-none absolute top-[-10%] left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-[140px]"
        aria-hidden
      />

      <div className="relative flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={transition}
        >
          <Badge
            variant="outline"
            className="border-white/15 bg-white/5 text-gray-200 backdrop-blur"
          >
            <Sparkles className="text-gold-400 size-3.5" aria-hidden />
            {siteConfig.tagline}
          </Badge>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.1 }}
        >
          <Heading as="h1" size="xl" className="mt-8 max-w-3xl text-white">
            {siteConfig.name}
          </Heading>
          <Paragraph
            tone="muted"
            size="lg"
            className="mx-auto mt-5 max-w-2xl text-balance text-gray-300"
          >
            {siteConfig.description}
          </Paragraph>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.2 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild variant="accent" size="lg">
            <Link href="/veille-juridique">
              Explorer la veille
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Link href="/comprendre">Comprendre les fondamentaux</Link>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
}
