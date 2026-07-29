"use client";

import { FileClock, Settings2, Shapes, ShieldCheck, Users } from "lucide-react";

import { AppSection } from "@/shared/components/app-section";

import { useAdminDashboardStats } from "../hooks/use-admin-dashboard-stats";
import { AdminQuickLinkCard } from "./admin-quick-link-card";
import { AdminSearch } from "./admin-search";
import { AdminStats } from "./admin-stats";

const QUICK_LINKS = [
  { href: "/administration/membres", label: "Membres", description: "Consulter et valider les membres.", icon: Users },
  { href: "/administration/roles", label: "Rôles", description: "Changer le rôle d'un membre.", icon: ShieldCheck },
  { href: "/administration/parametres", label: "Paramètres", description: "Nom, logo, fuseau horaire, langue.", icon: Settings2 },
  { href: "/administration/categories", label: "Catégories", description: "Listes configurables de la plateforme.", icon: Shapes },
  { href: "/administration/journal", label: "Journal", description: "Historique des actions notables.", icon: FileClock },
];

/**
 * Centre de gestion de la plateforme — statistiques agrégées, recherche
 * globale, accès rapide aux 4 sections d'administration. Assemble uniquement
 * des composants déjà autonomes (chacun gère ses propres données) : cette
 * page ne contient aucune logique métier.
 */
export function AdminDashboard() {
  const { data: stats, isLoading } = useAdminDashboardStats();

  return (
    <div className="space-y-6">
      <AdminStats stats={stats} isLoading={isLoading} />

      <AppSection title="Recherche globale" description="Membres, comptes rendus, sujets de prière, créneaux planifiés.">
        <AdminSearch />
      </AppSection>

      <AppSection title="Gestion" description="Accès rapide aux sections d'administration.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <AdminQuickLinkCard key={link.href} {...link} />
          ))}
        </div>
      </AppSection>
    </div>
  );
}
