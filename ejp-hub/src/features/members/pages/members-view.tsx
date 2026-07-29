"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import type { RowSelectionState } from "@tanstack/react-table";

import { useUser } from "@/features/auth/hooks/use-user";
import { AppButton } from "@/shared/components/app-button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import type { Role } from "@/shared/constants/roles";
import { Skeleton } from "@/shared/ui/skeleton";

import { MemberFilters } from "../components/member-filters";
import { MemberHeader } from "../components/member-header";
import { MemberStatistics } from "../components/member-statistics";
import { MemberTable } from "../components/member-table";
import { useAcceptMember, useReactivateMember, useRefuseMember, useSuspendMember } from "../hooks/use-member-mutations";
import { useMemberStats } from "../hooks/use-member-stats";
import { useMembers } from "../hooks/use-members";
import { applyMemberFilters, useMembersFilters } from "../hooks/use-members-filters";
import type { Member } from "../types/member.types";
import { getMemberPermissions } from "../utils/member-permissions";

export interface MembersViewProps {
  role: Role;
}

type PendingAction = { type: "suspend" | "refuse"; member: Member } | null;

/** Composition de la page Membres — statistiques, filtres, tableau. Câblée sur `/administration/membres`. */
export function MembersView({ role }: MembersViewProps) {
  const permissions = React.useMemo(() => getMemberPermissions(role), [role]);
  const { profile } = useUser();
  const router = useRouter();

  const { data: members, isLoading, isError, refetch } = useMembers();
  const { stats, isLoading: isStatsLoading } = useMemberStats();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useMembersFilters();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pendingAction, setPendingAction] = React.useState<PendingAction>(null);

  const acceptMutation = useAcceptMember();
  const refuseMutation = useRefuseMember();
  const suspendMutation = useSuspendMember();
  const reactivateMutation = useReactivateMember();

  const filteredMembers = React.useMemo(() => applyMemberFilters(members ?? [], filters), [members, filters]);
  const pendingCount = React.useMemo(() => (members ?? []).filter((member) => member.status === "PENDING").length, [members]);

  const callbacks = React.useMemo(
    () => ({
      onView: (member: Member) => router.push(`/administration/membres/${member.id}`),
      onAccept: (member: Member) => profile && acceptMutation.mutate({ id: member.id, adminId: profile.id }),
      onRefuse: (member: Member) => setPendingAction({ type: "refuse", member }),
      onSuspend: (member: Member) => setPendingAction({ type: "suspend", member }),
      onReactivate: (member: Member) => reactivateMutation.mutate(member.id),
    }),
    [router, profile, acceptMutation, reactivateMutation],
  );

  return (
    <div className="space-y-6">
      <MemberHeader permissions={permissions} pendingCount={pendingCount} />

      <MemberStatistics stats={stats} isLoading={isStatsLoading} />

      <MemberFilters filters={filters} onChange={updateFilter} onReset={resetFilters} hasActiveFilters={hasActiveFilters} />

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">Impossible de charger les membres pour le moment.</p>
          <AppButton variant="outline" size="sm" onClick={() => refetch()}>
            Réessayer
          </AppButton>
        </div>
      )}

      {!isLoading && !isError && (
        <MemberTable
          members={filteredMembers}
          permissions={permissions}
          callbacks={callbacks}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      )}

      <ConfirmDialog
        open={pendingAction?.type === "refuse"}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Refuser cette demande d'adhésion ?"
        description={`La demande de « ${pendingAction?.member.fullName} » sera marquée comme refusée.`}
        confirmLabel="Refuser"
        isLoading={refuseMutation.isPending}
        onConfirm={async () => {
          if (!pendingAction || !profile) return;
          await refuseMutation.mutateAsync({ id: pendingAction.member.id, adminId: profile.id });
          setPendingAction(null);
        }}
      />

      <ConfirmDialog
        open={pendingAction?.type === "suspend"}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Suspendre ce membre ?"
        description={`« ${pendingAction?.member.fullName} » ne pourra plus se connecter tant que son compte n'est pas réactivé.`}
        confirmLabel="Suspendre"
        isLoading={suspendMutation.isPending}
        onConfirm={async () => {
          if (!pendingAction || !profile) return;
          await suspendMutation.mutateAsync({ id: pendingAction.member.id, adminId: profile.id });
          setPendingAction(null);
        }}
      />
    </div>
  );
}
