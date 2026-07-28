"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";

import { signOutAction } from "@/features/auth/actions/sign-out.action";
import { ROUTES } from "@/shared/constants/app";
import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { AppAvatar } from "@/shared/components/app-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function UserMenu({ profile }: { profile: CurrentProfile }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <AppAvatar name={profile.full_name} src={profile.avatar_url} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{profile.full_name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{profile.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROUTES.profile}>
            <UserRound className="size-4" />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOutAction()} className="text-destructive focus:text-destructive">
          <LogOut className="size-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
