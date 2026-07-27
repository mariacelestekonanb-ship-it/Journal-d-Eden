"use client";

import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface Node {
  x: number;
  y: number;
  r: number;
}

const NODES: Node[] = [
  { x: 80, y: 90, r: 5 },
  { x: 210, y: 60, r: 7 },
  { x: 320, y: 120, r: 4 },
  { x: 140, y: 200, r: 9 },
  { x: 280, y: 230, r: 5 },
  { x: 90, y: 300, r: 4 },
  { x: 230, y: 330, r: 6 },
];

const LINKS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [2, 4],
  [3, 5],
  [3, 6],
  [4, 6],
];

/**
 * Illustration abstraite de la page « À propos » : un réseau de nœuds
 * reliés, plutôt que la sphère orbitale du Hero d'accueil (voir
 * `components/home/orbital-illustration.tsx`) — même langage visuel (fond
 * grille bleu nuit, lueur dorée, points lumineux) mais une composition
 * distincte, pour éviter de dupliquer le Hero de l'accueil. Évoque la mise
 * en réseau de connaissances plutôt que l'espace. Purement décorative.
 */
export function AboutHeroIllustration() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="bg-grid-navy relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/10"
    >
      <div className="bg-gold-500/20 pointer-events-none absolute top-1/2 left-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]" />

      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 size-full"
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
      >
        {LINKS.map(([a, b], index) => (
          <line
            key={index}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="rgba(217,185,74,0.35)"
            strokeWidth={1}
          />
        ))}
        {NODES.map((node, index) => (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={index === 3 ? "#d9b94a" : "rgba(255,255,255,0.85)"}
          />
        ))}
      </motion.svg>

      <span className="absolute top-[15%] right-[20%] size-1 rounded-full bg-white/50" />
      <span className="absolute bottom-[22%] left-[24%] size-1.5 rounded-full bg-white/40" />
    </div>
  );
}
