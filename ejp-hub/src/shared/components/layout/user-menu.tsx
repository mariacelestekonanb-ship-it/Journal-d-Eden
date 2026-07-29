"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";

import { signOutAction } from "@/features/auth";
import { AppAvatar } from "@/shared/components/app-avatar";
import { AppBadge } from "@/shared/components/app-badge";
import { ROUTES } from "@/shared/constants/app";
import { ROLE_LABELS } from "@/shared/constants/roles";
import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { getFullName } from "@/shared/utils/get-full-name";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

/**
 * Affiche le nom, l'avatar et le rôle de l'utilisateur connecté (menu
 * déroulant), ainsi qu'un bouton de déconnexion directement accessible.
 */
export function UserMenu({ profile }: { profile: CurrentProfile }) {
  const fullName = getFullName(profile);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="hidden flex-col items-end leading-tight sm:flex">
            <span className="text-sm font-medium text-foreground">{fullName}</span>
            <span className="text-xs text-muted-foreground">{ROLE_LABELS[profile.role]}</span>
          </span>
          <AppAvatar name={fullName} src={profile.avatar_url} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span className="font-medium">{fullName}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">{profile.email}</span>
            <AppBadge variant="secondary" className="w-fit">
              {ROLE_LABELS[profile.role]}
            </AppBadge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={ROUTES.profile}>
              <UserRound className="size-4" />
              Mon profil
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Se déconnecter"
            onClick={() => void signOutAction()}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Se déconnecter</TooltipContent>
      </Tooltip>
    </div>
  );
}
