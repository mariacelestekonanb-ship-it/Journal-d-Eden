"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { AppCard, AppCardContent, AppCardHeader } from "@/shared/components/app-card";

import { SectionTitle } from "./section-title";

export interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  /** Délai d'apparition (secondes), pour un effet d'entrée en cascade entre les sections. */
  delay?: number;
  className?: string;
}

/**
 * Carte générique du tableau de bord : en-tête (`SectionTitle`) + contenu,
 * avec une apparition progressive discrète à l'affichage. Sert de socle
 * réutilisable à toutes les sections du Dashboard (créneaux, sujets,
 * notifications, activité, actions rapides).
 */
export function DashboardCard({ title, description, icon, action, children, delay = 0, className }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      <AppCard className={className}>
        <AppCardHeader>
          <SectionTitle title={title} description={description} icon={icon} action={action} />
        </AppCardHeader>
        <AppCardContent className="space-y-3">{children}</AppCardContent>
      </AppCard>
    </motion.div>
  );
}
