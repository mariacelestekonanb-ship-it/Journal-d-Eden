"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { AdminSidebar } from "@/components/admin/layout/sidebar";
import { AdminSearch } from "@/components/admin/search/admin-search";
import { UserMenuPlaceholder } from "@/components/admin/layout/user-menu-placeholder";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDisclosure } from "@/hooks/use-disclosure";
import type { AdminUser } from "@/lib/admin/auth";

export interface AdminShellProps {
  user: AdminUser;
  children: ReactNode;
}

/**
 * Coquille de l'espace d'administration : navigation fixe sur desktop,
 * tiroir sur mobile/tablette (voir `Sheet`, déjà utilisé par le menu mobile
 * du site public), barre supérieure avec recherche globale et emplacement
 * utilisateur.
 */
export function AdminShell({ user, children }: AdminShellProps) {
  const mobileNav = useDisclosure();

  return (
    <div className="bg-muted/30 flex min-h-screen">
      <AdminSidebar className="hidden w-64 shrink-0 lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/95 sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
          <Sheet open={mobileNav.isOpen} onOpenChange={mobileNav.setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Ouvrir la navigation"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              open={mobileNav.isOpen}
              className="w-72 max-w-[80%] p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation de l&apos;administration</SheetTitle>
              </SheetHeader>
              <AdminSidebar className="h-full" onNavigate={mobileNav.close} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <AdminSearch />
          </div>

          <UserMenuPlaceholder user={user} />
        </header>

        <main
          id="admin-main-content"
          className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
