"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/site-config";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useScrolled } from "@/hooks/use-scrolled";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { SearchDialog } from "@/components/shared/search-dialog";

/**
 * En-tête global de la plateforme : navigation desktop, recherche globale et
 * menu tiroir sur mobile. Sticky avec fond flouté et ombre discrète dès que
 * la page défile (voir `useScrolled`).
 */
export function Header() {
  const pathname = usePathname();
  const isScrolled = useScrolled();
  const mobileNav = useDisclosure();
  const search = useDisclosure();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "border-border bg-background/80 border-b shadow-[0_1px_0_0_rgba(15,29,58,0.04)] backdrop-blur-lg"
          : "bg-background/60 border-b border-transparent backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Logo />

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 lg:flex"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "focus-visible:ring-ring rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                isActive(item.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Rechercher"
            onClick={search.open}
          >
            <Search className="size-4.5" />
          </Button>
          <Button asChild variant="accent" size="sm">
            <Link href="/veille-juridique">Voir la veille</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Rechercher"
            onClick={search.open}
          >
            <Search className="size-4.5" />
          </Button>

          <Sheet open={mobileNav.isOpen} onOpenChange={mobileNav.setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" open={mobileNav.isOpen}>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Navigation principale"
                className="flex flex-col gap-1 px-6"
              >
                {mainNav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "focus-visible:ring-ring rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        isActive(item.href)
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto px-6 pb-6">
                <Button asChild variant="accent" className="w-full">
                  <Link href="/veille-juridique">Voir la veille</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchDialog open={search.isOpen} onOpenChange={search.setIsOpen} />
    </header>
  );
}
