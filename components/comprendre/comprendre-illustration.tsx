"use client";

import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Illustration abstraite du Hero de « Comprendre » : des formes
 * géométriques stables (hexagone, losange) évoquant une structure de
 * connaissances organisée, traversées par une orbite qui tourne lentement
 * — même langage visuel que les autres illustrations du site (fond grille
 * bleu nuit, lueur dorée), mais une composition distincte de la sphère de
 * l'accueil (`OrbitalIllustration`) et du réseau de nœuds de la page « À
 * propos » (`AboutHeroIllustration`). Aucune image générée : uniquement
 * des formes SVG. Purement décorative.
 */
export function ComprendreIllustration() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="bg-grid-navy relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/10"
    >
      <div className="bg-gold-500/20 pointer-events-none absolute top-1/2 left-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]" />

      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        {/* Hexagone : la structure des connaissances */}
        <polygon
          points="200,70 305,130 305,250 200,310 95,250 95,130"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1.5}
        />
        {/* Losange intérieur */}
        <rect
          x="150"
          y="150"
          width="100"
          height="100"
          fill="none"
          stroke="rgba(217,185,74,0.25)"
          strokeWidth={1}
          transform="rotate(45 200 200)"
        />

        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 50, repeat: Infinity, ease: "linear" }
          }
        >
          <ellipse
            cx="200"
            cy="200"
            rx="150"
            ry="60"
            fill="none"
            stroke="rgba(217,185,74,0.4)"
            strokeWidth={1.5}
          />
          <circle cx="350" cy="200" r="6" fill="#d9b94a" />
          <circle cx="50" cy="200" r="4" fill="rgba(255,255,255,0.8)" />
        </motion.g>

        <circle cx="200" cy="200" r="9" fill="#d9b94a" opacity={0.9} />
      </svg>

      <span className="absolute top-[18%] right-[22%] size-1 rounded-full bg-white/50" />
      <span className="absolute bottom-[20%] left-[20%] size-1.5 rounded-full bg-white/40" />
    </div>
  );
}
