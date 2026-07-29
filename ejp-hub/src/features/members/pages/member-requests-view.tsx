"use client";

import { ArrowLeft, CheckCircle2, Eye, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUser } from "@/features/auth/hooks/use-user";
import { AppButton } from "@/shared/components/app-button";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { MemberCard } from "../components/member-card";
import { MemberEmptyState } from "../components/member-empty-state";
import { useAcceptMember, useRefuseMember } from "../hooks/use-member-mutations";
import { usePendingMembers } from "../hooks/use-member-stats";
import type { Member } from "../types/member.types";

/**
 * Page dédiée aux demandes d'adhésion en attente — n'affiche que les
 * membres `PENDING` (voir `usePendingMembers`), avec confirmation
 * obligatoire avant d'accepter ou de refuser.
 */
export function MemberRequestsView() {
  const { profile } = useUser();
  const router = useRouter();
  const { data: pendingMembers, isLoading, isError, refetch } = usePendingMembers();
  const [refusingMember, setRefusingMember] = React.useState<Member | null>(null);

  const acceptMutation = useAcceptMember();
  const refuseMutation = useRefuseMember();

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/administration">
          <ArrowLeft className="size-4" />
          Retour aux membres
        </Link>
      </Button>

      <AppPageHeader
        title="Demandes d'adhésion"
        description="Examinez chaque demande avant de l'accepter ou de la refuser — l'acceptation active le compte et attribue le rôle Conducteur de prière."
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">Impossible de charger les demandes pour le moment.</p>
          <AppButton variant="outline" size="sm" onClick={() => refetch()}>
            Réessayer
          </AppButton>
        </div>
      )}

      {!isLoading && !isError && pendingMembers.length === 0 && (
        <MemberEmptyState title="Aucune demande en attente" description="Toutes les demandes d'adhésion ont déjà été traitées." />
      )}

      {!isLoading && !isError && pendingMembers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pendingMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              actions={
                <>
                  <AppButton variant="ghost" size="sm" onClick={() => router.push(`/administration/${member.id}`)}>
                    <Eye className="size-4" />
                    Consulter
                  </AppButton>
                  <AppButton variant="outline" size="sm" onClick={() => setRefusingMember(member)}>
                    <XCircle className="size-4" />
                    Refuser
                  </AppButton>
                  <AppButton
                    size="sm"
                    isLoading={acceptMutation.isPending}
                    onClick={() => profile && acceptMutation.mutate({ id: member.id, adminId: profile.id })}
                  >
                    <CheckCircle2 className="size-4" />
                    Accepter
                  </AppButton>
                </>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!refusingMember}
        onOpenChange={(open) => !open && setRefusingMember(null)}
        title="Refuser cette demande d'adhésion ?"
        description={`La demande de « ${refusingMember?.fullName} » sera marquée comme refusée.`}
        confirmLabel="Refuser"
        isLoading={refuseMutation.isPending}
        onConfirm={async () => {
          if (!refusingMember || !profile) return;
          await refuseMutation.mutateAsync({ id: refusingMember.id, adminId: profile.id });
          setRefusingMember(null);
        }}
      />
    </div>
  );
}
