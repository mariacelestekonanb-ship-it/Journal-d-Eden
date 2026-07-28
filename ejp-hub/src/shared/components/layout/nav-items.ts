import {
  BookHeart,
  CalendarDays,
  FileText,
  ImportIcon,
  LayoutDashboard,
  Megaphone,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";

import type { UserRole } from "@/types/database";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/", icon: LayoutDashboard, roles: ["admin", "conducteur"] },
  { label: "Planning", href: "/planning", icon: CalendarDays, roles: ["admin", "conducteur"] },
  { label: "Sujets de prière", href: "/sujets-de-priere", icon: Sparkles, roles: ["admin", "conducteur"] },
  { label: "Comptes rendus", href: "/comptes-rendus", icon: FileText, roles: ["admin", "conducteur"] },
  { label: "Témoignages", href: "/temoignages", icon: BookHeart, roles: ["admin", "conducteur"] },
  { label: "Notifications", href: "/notifications", icon: Megaphone, roles: ["admin", "conducteur"] },
  { label: "Import / Export", href: "/import-export", icon: ImportIcon, roles: ["admin"] },
  { label: "Mon profil", href: "/mon-profil", icon: UserRound, roles: ["admin", "conducteur"] },
  { label: "Administration", href: "/administration", icon: Settings2, roles: ["admin"] },
];
