"use client";

import { CalendarDays, FileText, HeartHandshake, Search, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";
import { AppCard } from "@/shared/components/app-card";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";

import { useAdminSearch } from "../hooks/use-admin-search";
import type { AdminSearchResultType } from "../types/admin.types";

const MIN_QUERY_LENGTH = 2;

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
 * Recherche globale — interroge membres, comptes rendus, sujets de prière et
 * planning en un seul appel (voir `AdminService.search`). Architecture
 * extensible : un module cherchable de plus se résume à une entrée dans
 * `TYPE_ICON`/`TYPE_LABEL` et un nouveau cas côté service.
 */
export function AdminSearch() {
  const [query, setQuery] = React.useState("");
  const trimmed = query.trim();
  const { data: results, isFetching } = useAdminSearch(query);

  return (
    <AppCard className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un membre, un compte rendu, un sujet de prière, un créneau…"
          className="pl-9"
          aria-label="Recherche globale de l'administration"
        />
      </div>

      {trimmed.length >= MIN_QUERY_LENGTH && (
        <div className="mt-3 space-y-1">
          {isFetching && (
            <>
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </>
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
        </div>
      )}
    </AppCard>
  );
}
