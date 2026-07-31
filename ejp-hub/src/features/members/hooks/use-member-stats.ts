"use client";

import * as React from "react";

import type { Member, MemberStatsSummary } from "../types/member.types";
import { useMembers } from "./use-members";

/**
 * Calcule les indicateurs du module à partir des membres déjà en cache —
 * aucun appel réseau supplémentaire. `totalCount` exclut les demandes
 * `REFUSED` : une personne refusée n'est jamais devenue membre, elle ne
 * doit donc pas gonfler ce total (elle reste visible via le filtre de
 * statut de la liste, juste absente de ce compteur).
 */
export function computeMemberStats(members: Member[]): MemberStatsSummary {
  return {
    totalCount: members.filter((member) => member.status !== "REFUSED" && !member.deletedAt).length,
    activeCount: members.filter((member) => member.status === "ACTIVE" && !member.deletedAt).length,
    pendingCount: members.filter((member) => member.status === "PENDING" && !member.deletedAt).length,
    suspendedCount: members.filter((member) => member.status === "SUSPENDED" && !member.deletedAt).length,
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
