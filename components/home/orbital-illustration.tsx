"use client";

import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface OrbitRingProps {
  tiltDeg: number;
  sizePercent: number;
  duration: number;
  reverse?: boolean;
  dotClassName: string;
}

/**
 * Un anneau orbital elliptique : le tilt (rotation statique) et
 * l'aplatissement (`scaleY`) créent la perspective, la rotation continue
 * anime le point qui le longe. Désactivée si l'utilisateur préfère moins
 * de mouvement.
 */
function OrbitRing({
  tiltDeg,
  sizePercent,
  duration,
  reverse = false,
  dotClassName,
}: OrbitRingProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform: `rotate(${tiltDeg}deg)` }}
    >
      <motion.div
        className="relative rounded-full border border-white/15"
        style={{ width: `${sizePercent}%`, aspectRatio: "1 / 1", scaleY: 0.4 }}
        animate={
          prefersReducedMotion ? undefined : { rotate: reverse ? -360 : 360 }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration, repeat: Infinity, ease: "linear" }
        }
      >
        <span
          className={`absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full ${dotClassName}`}
        />
      </motion.div>
    </div>
  );
}

/**
 * Illustration abstraite du Hero : sphère lumineuse, anneaux orbitaux et
 * grille discrète — évoque l'espace sans représenter une planète réaliste.
 * Purement décorative (`aria-hidden`).
 */
export function OrbitalIllustration() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="bg-grid-navy relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/10"
    >
      {/* Lueur diffuse */}
      <div className="bg-gold-500/25 pointer-events-none absolute top-1/2 left-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />

      {/* Sphère abstraite */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute top-1/2 left-1/2 size-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_60px_10px_rgba(201,162,39,0.15)] blur-[6px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), rgba(217,185,74,0.22) 45%, rgba(217,185,74,0.02) 100%)",
        }}
      />

      <OrbitRing
        tiltDeg={-18}
        sizePercent={62}
        duration={42}
        dotClassName="bg-gold-400 shadow-[0_0_10px_2px_rgba(217,185,74,0.7)]"
      />
      <OrbitRing
        tiltDeg={12}
        sizePercent={88}
        duration={64}
        reverse
        dotClassName="bg-white/80 shadow-[0_0_8px_1px_rgba(255,255,255,0.6)]"
      />

      {/* Points discrets évoquant un champ d'étoiles */}
      <span className="absolute top-[22%] left-[18%] size-1 rounded-full bg-white/60" />
      <span className="absolute top-[65%] right-[24%] size-1 rounded-full bg-white/40" />
      <span className="absolute bottom-[18%] left-[38%] size-1.5 rounded-full bg-white/50" />
    </div>
  );
}
