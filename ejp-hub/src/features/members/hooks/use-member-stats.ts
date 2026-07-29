"use client";

import * as React from "react";

import type { Member, MemberStatsSummary } from "../types/member.types";
import { useMembers } from "./use-members";

/** Calcule les indicateurs du module à partir des membres déjà en cache — aucun appel réseau supplémentaire. */
export function computeMemberStats(members: Member[]): MemberStatsSummary {
  return {
    totalCount: members.length,
    activeCount: members.filter((member) => member.status === "ACTIVE").length,
    pendingCount: members.filter((member) => member.status === "PENDING").length,
    suspendedCount: members.filter((member) => member.status === "SUSPENDED").length,
  };
}

export function useMemberStats() {
  const { data: members, isLoading } = useMembers();
  const stats = React.useMemo(() => computeMemberStats(members ?? []), [members]);
  return { stats, isLoading };
}

/** Sous-ensemble des membres en attente — alimente la page dédiée « Demandes d'adhésion ». */
export function usePendingMembers() {
  const { data: members, isLoading, isError, refetch } = useMembers();
  const pending = React.useMemo(() => (members ?? []).filter((member) => member.status === "PENDING"), [members]);
  return { data: pending, isLoading, isError, refetch };
}
