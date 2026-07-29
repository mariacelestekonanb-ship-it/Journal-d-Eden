"use client";

import * as React from "react";

import { EMPTY_MEMBER_FILTERS, type Member, type MemberFilters } from "../types/member.types";

/** État des filtres combinables (recherche, statut, rôle). */
export function useMembersFilters() {
  const [filters, setFilters] = React.useState<MemberFilters>(EMPTY_MEMBER_FILTERS);

  const updateFilter = React.useCallback(<K extends keyof MemberFilters>(key: K, value: MemberFilters[K]) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const resetFilters = React.useCallback(() => setFilters(EMPTY_MEMBER_FILTERS), []);

  const hasActiveFilters = React.useMemo(
    () => filters.search !== "" || filters.status !== null || filters.role !== null,
    [filters],
  );

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

/** Applique la recherche et tous les filtres combinés — fonction pure, testable indépendamment. */
export function applyMemberFilters(members: Member[], filters: MemberFilters): Member[] {
  const search = filters.search.trim().toLowerCase();

  return members.filter((member) => {
    if (search) {
      const haystack = `${member.fullName} ${member.email} ${member.phone ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filters.status && member.status !== filters.status) return false;
    if (filters.role && member.role !== filters.role) return false;
    return true;
  });
}
