"use client";

import { Menu, Search } from "lucide-react";

import { useRole } from "@/features/auth";
import { NotificationBell } from "@/features/notifications";
import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { HeaderSearch } from "./header-search";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Header({
  profile,
  onOpenMobileNav,
}: {
  profile: CurrentProfile;
  onOpenMobileNav: () => void;
}) {
  const { isAdmin } = useRole();

  return (
    <header className="no-print flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Ouvrir le menu"
        onClick={onOpenMobileNav}
      >
        <Menu className="size-5" />
      </Button>

      <div className="hidden max-w-sm flex-1 md:block">
        {isAdmin ? (
          <HeaderSearch />
        ) : (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher… (réservé aux administrateurs)"
              className="pl-9"
              disabled
              aria-label="Recherche"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-1">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu profile={profile} />
      </div>
    </header>
  );
}
