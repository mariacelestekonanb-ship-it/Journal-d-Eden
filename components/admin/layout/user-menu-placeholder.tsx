"use client";

import { LogOut, UserCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUser } from "@/lib/admin/auth";

export interface UserMenuPlaceholderProps {
  user: AdminUser;
}

/**
 * Emplacement utilisateur, prêt pour une vraie authentification : le nom
 * et le rôle viennent de `getCurrentAdminUser` (voir `lib/admin/auth.ts`),
 * aujourd'hui une constante fixe. Les actions restent désactivées tant
 * qu'aucune session réelle n'existe.
 */
export function UserMenuPlaceholder({ user }: UserMenuPlaceholderProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hover:bg-secondary focus-visible:ring-ring flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <span
            aria-hidden
            className="bg-navy-900 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          >
            {user.initiales}
          </span>
          <span className="hidden text-left sm:block">
            <span className="text-foreground block text-sm leading-tight font-medium">
              {user.nom}
            </span>
            <span className="text-muted-foreground block text-xs leading-tight">
              {user.role}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem disabled>
          <UserCircle aria-hidden />
          Mon profil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled variant="danger">
          <LogOut aria-hidden />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
