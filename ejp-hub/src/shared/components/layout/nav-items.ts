import { CalendarDays, FileText, HeartHandshake, Home, Settings2, Sparkles, UserRound } from "lucide-react";

import type { Role } from "@/shared/constants/roles";
import { ROUTE_PERMISSIONS } from "@/shared/constants/route-permissions";

const ALL_ROLES: Role[] = ["ADMIN", "PRAYER_LEADER"];

export interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
  roles: Role[];
  /** Insère un séparateur visuel avant cet élément (ex. avant Administration). */
  separatorBefore?: boolean;
}

/** Rôles autorisés pour une route, déduits de ROUTE_PERMISSIONS (sinon accessible à tous). */
function rolesFor(href: string): Role[] {
  return ROUTE_PERMISSIONS.find((permission) => permission.prefix === href)?.roles ?? ALL_ROLES;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/", icon: Home, roles: rolesFor("/") },
  { label: "Planning", href: "/planning", icon: CalendarDays, roles: rolesFor("/planning") },
  {
    label: "Sujets de prière",
    href: "/sujets-de-priere",
    icon: HeartHandshake,
    roles: rolesFor("/sujets-de-priere"),
  },
  { label: "Comptes rendus", href: "/comptes-rendus", icon: FileText, roles: rolesFor("/comptes-rendus") },
  { label: "Témoignages", href: "/temoignages", icon: Sparkles, roles: rolesFor("/temoignages") },
  { label: "Mon profil", href: "/mon-profil", icon: UserRound, roles: rolesFor("/mon-profil") },
  {
    label: "Administration",
    href: "/administration",
    icon: Settings2,
    roles: rolesFor("/administration"),
    separatorBefore: true,
  },
];
