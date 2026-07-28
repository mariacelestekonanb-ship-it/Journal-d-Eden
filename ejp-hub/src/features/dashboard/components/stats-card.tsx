"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { AppCard } from "@/shared/components/app-card";
import { Skeleton } from "@/shared/ui/skeleton";

export interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  isLoading?: boolean;
  /** Délai d'apparition (secondes), pour l'effet de cascade dans la grille de statistiques. */
  delay?: number;
}

/** Carte de statistique du tableau de bord — réutilisable pour tout indicateur chiffré. */
export function StatsCard({ label, value, icon: Icon, isLoading, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="h-full focus-visible:outline-none"
    >
      <AppCard
        className="h-full p-5 transition-shadow hover:shadow-md"
        role="group"
        aria-label={`${label} : ${isLoading ? "chargement" : value}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
            <Icon className="size-4 text-accent-foreground" />
          </span>
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-16" />
        ) : (
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        )}
      </AppCard>
    </motion.div>
  );
}
