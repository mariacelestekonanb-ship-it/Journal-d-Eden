import { CalendarDays, FileText, HeartHandshake, Home, Settings2, Sparkles, UserRound } from "lucide-react";

import type { UserRole } from "@/shared/types/database";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
  roles: UserRole[];
  /** Insère un séparateur visuel avant cet élément (ex. avant Administration). */
  separatorBefore?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/", icon: Home, roles: ["admin", "conducteur"] },
  { label: "Planning", href: "/planning", icon: CalendarDays, roles: ["admin", "conducteur"] },
  { label: "Sujets de prière", href: "/sujets-de-priere", icon: HeartHandshake, roles: ["admin", "conducteur"] },
  { label: "Comptes rendus", href: "/comptes-rendus", icon: FileText, roles: ["admin", "conducteur"] },
  { label: "Témoignages", href: "/temoignages", icon: Sparkles, roles: ["admin", "conducteur"] },
  { label: "Mon profil", href: "/mon-profil", icon: UserRound, roles: ["admin", "conducteur"] },
  {
    label: "Administration",
    href: "/administration",
    icon: Settings2,
    roles: ["admin"],
    separatorBefore: true,
  },
];
