"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface AdminQuickLinkCardProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

/** Raccourci vers une section de gestion (rôles, paramètres, catégories, journal). */
export function AdminQuickLinkCard({ href, label, description, icon: Icon }: AdminQuickLinkCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link
        href={href}
        className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
          <Icon className="size-4 text-accent-foreground" />
        </span>
        <span>
          <span className="block text-sm font-medium text-foreground">{label}</span>
          <span className="block text-xs text-muted-foreground">{description}</span>
        </span>
      </Link>
    </motion.div>
  );
}
