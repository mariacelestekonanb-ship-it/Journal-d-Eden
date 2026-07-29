"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { useUser } from "@/features/auth/hooks/use-user";

import { AdminService } from "../services/admin.service";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

/** Débounce local — la recherche interroge plusieurs services à chaque appel, pas de cache partagé à réutiliser. */
export function useAdminSearch(query: string) {
  const { profile } = useUser();
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  const trimmed = debouncedQuery.trim();

  return useQuery({
    queryKey: ["admin", "search", trimmed, profile?.id],
    queryFn: () => AdminService.search(trimmed, profile!.id),
    enabled: !!profile && trimmed.length >= MIN_QUERY_LENGTH,
    staleTime: 30 * 1000,
  });
}
