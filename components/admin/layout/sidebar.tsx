"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  BookMarked,
  FolderOpen,
  FolderTree,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface NavEntry {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ENTRIES: NavEntry[] = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Fiches", href: "/admin/fiches", icon: BookOpen },
  { label: "Veille juridique", href: "/admin/veille", icon: Newspaper },
  { label: "Glossaire", href: "/admin/glossaire", icon: BookMarked },
  { label: "Ressources", href: "/admin/ressources", icon: FolderOpen },
  { label: "Catégories", href: "/admin/categories", icon: FolderTree },
  { label: "Médiathèque", href: "/admin/medias", icon: ImageIcon },
  { label: "Réglages", href: "/admin/reglages", icon: Settings },
];

export interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
  /** Logo déposé depuis /admin/reglages (voir `SiteSettings.branding.logoUrl`). */
  logoUrl?: string;
}

/** Navigation principale de l'espace d'administration — identité visuellement distincte du site public (fond bleu nuit plein). */
export function AdminSidebar({
  className,
  onNavigate,
  logoUrl,
}: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <div
      className={cn(
        "bg-navy-950 flex h-full flex-col text-gray-300",
        className,
      )}
    >
      <div className="flex h-20 items-center px-6">
        <Logo inverted logoUrl={logoUrl} />
      </div>

      <nav aria-label="Navigation de l'administration" className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ENTRIES.map((entry) => {
            const active = isActive(entry.href);
            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-gold-400 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 hover:text-white",
                  )}
                >
                  <entry.icon className="size-4.5 shrink-0" aria-hidden />
                  {entry.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="focus-visible:ring-gold-400 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:outline-none"
        >
          <ExternalLink className="size-4.5 shrink-0" aria-hidden />
          Voir le site public
        </Link>
      </div>
    </div>
  );
}
