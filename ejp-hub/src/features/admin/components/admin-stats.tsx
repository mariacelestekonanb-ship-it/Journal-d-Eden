"use client";

import { motion } from "framer-motion";
import { Bell, CalendarCheck, FileClock, HeartHandshake, ShieldCheck, UserCheck, Users, type LucideIcon } from "lucide-react";

import { AppCard } from "@/shared/components/app-card";
import { Skeleton } from "@/shared/ui/skeleton";

import type { AdminDashboardStats } from "../types/admin.types";

export interface AdminStatsProps {
  stats?: AdminDashboardStats;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: number;
  icon: LucideIcon;
}

/** Les 7 indicateurs du tableau de bord — carte réutilisable, cascade Framer Motion. */
export function AdminStats({ stats, isLoading }: AdminStatsProps) {
  const tiles: Tile[] = [
    { label: "Membres", value: stats?.totalMembers ?? 0, icon: Users },
    { label: "Conducteurs actifs", value: stats?.activeLeaders ?? 0, icon: UserCheck },
    { label: "Demandes en attente", value: stats?.pendingMembershipRequests ?? 0, icon: ShieldCheck },
    { label: "Créneaux planifiés", value: stats?.scheduledSlots ?? 0, icon: CalendarCheck },
    { label: "Comptes rendus en attente", value: stats?.pendingReports ?? 0, icon: FileClock },
    { label: "Sujets de prière actifs", value: stats?.activePrayerTopics ?? 0, icon: HeartHandshake },
    { label: "Notifications non lues", value: stats?.unreadNotifications ?? 0, icon: Bell },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, index) => (
        <motion.div
          key={tile.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
          className="h-full focus-visible:outline-none"
        >
          <AppCard
            className="h-full p-4 transition-shadow hover:shadow-md"
            role="group"
            aria-label={`${tile.label} : ${isLoading ? "chargement" : tile.value}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{tile.label}</p>
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
                <tile.icon className="size-4 text-accent-foreground" />
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="mt-3 h-8 w-14" />
            ) : (
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{tile.value}</p>
            )}
          </AppCard>
        </motion.div>
      ))}
    </div>
  );
}
