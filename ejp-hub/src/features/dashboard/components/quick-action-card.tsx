"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface QuickActionCardProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

/** Raccourci d'action rapide — bouton atomique et réutilisable. */
export function QuickActionCard({ label, icon: Icon, onClick }: QuickActionCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
        <Icon className="size-4 text-accent-foreground" />
      </span>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </motion.button>
  );
}
