"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FileText, HeartHandshake, Search, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AdminService, type AdminSearchResultType } from "@/features/admin";
import { useUser } from "@/features/auth";
import { AppBadge } from "@/shared/components/app-badge";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/shared/ui/popover";
import { Skeleton } from "@/shared/ui/skeleton";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

const TYPE_ICON: Record<AdminSearchResultType, LucideIcon> = {
  MEMBER: Users,
  REPORT: FileText,
  PRAYER_TOPIC: HeartHandshake,
  PLANNING: CalendarDays,
};

const TYPE_LABEL: Record<AdminSearchResultType, string> = {
  MEMBER: "Membre",
  REPORT: "Compte rendu",
  PRAYER_TOPIC: "Sujet de prière",
  PLANNING: "Planning",
};

/**
 * Recherche globale du Header — réutilise `AdminService.search` (déjà
 * utilisé par la recherche de `/administration`). Rendue uniquement pour un
 * administrateur (voir `header.tsx`) : la Row Level Security limite déjà les
 * résultats réels au périmètre de qui appelle, mais les liens produits
 * (`/administration/membres/...`) ne sont de toute façon navigables que par
 * un administrateur.
 */
export function HeaderSearch() {
  const { profile } = useUser();
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  const trimmed = debouncedQuery.trim();

  const { data: results, isFetching } = useQuery({
    queryKey: ["header-search", trimmed, profile?.id],
    queryFn: () => AdminService.search(trimmed, profile!.id),
    enabled: !!profile && trimmed.length >= MIN_QUERY_LENGTH,
    staleTime: 30 * 1000,
  });

  const showResults = isOpen && query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <Popover open={showResults} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => query.trim().length >= MIN_QUERY_LENGTH && setIsOpen(true)}
            placeholder="Rechercher un membre, un compte rendu, un sujet, un créneau…"
            className="pl-9"
            aria-label="Recherche globale"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="max-h-80 w-96 overflow-y-auto p-2"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {isFetching && (
          <div className="space-y-1">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        )}
        {!isFetching && results?.length === 0 && (
          <p className="px-1 py-3 text-sm text-muted-foreground">Aucun résultat pour « {trimmed} ».</p>
        )}
        {!isFetching &&
          results?.map((result) => {
            const Icon = TYPE_ICON[result.type];
            return (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.url}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted" aria-hidden="true">
                  <Icon className="size-4 text-muted-foreground" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">{result.title}</span>
                  {result.subtitle && <span className="block truncate text-xs text-muted-foreground">{result.subtitle}</span>}
                </span>
                <AppBadge variant="outline" className="shrink-0 text-[10px]">
                  {TYPE_LABEL[result.type]}
                </AppBadge>
              </Link>
            );
          })}
      </PopoverContent>
    </Popover>
  );
}
