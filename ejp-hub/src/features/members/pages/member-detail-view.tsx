"use client";

import { ArrowLeft, CheckCircle2, Mail, RotateCcw, ShieldAlert, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUser } from "@/features/auth/hooks/use-user";
import { AppAvatar } from "@/shared/components/app-avatar";
import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import type { Role } from "@/shared/constants/roles";
import { ROLES, ROLE_LABELS } from "@/shared/constants/roles";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate, formatDateTime } from "@/shared/utils/format";

import { MemberEmailDialog } from "../components/member-email-dialog";
import { MemberEmptyState } from "../components/member-empty-state";
import { MemberHistoryList } from "../components/member-history-list";
import { MemberRoleBadge } from "../components/member-role-badge";
import { MemberStatusBadge } from "../components/member-status-badge";
import {
  useAcceptMember,
  useChangeMemberRole,
  useReactivateMember,
  useRefuseMember,
  useSuspendMember,
} from "../hooks/use-member-mutations";
import { useMember, useMemberAssignments, useMemberReports } from "../hooks/use-members";
import { MemberWorkflowService } from "../services/member-workflow.service";
import {
  PLANNING_STATUS_LABELS_FOR_HISTORY,
  REPORT_STATUS_LABELS_FOR_HISTORY,
} from "../utils/member-history-labels";
import { getMemberPermissions } from "../utils/member-permissions";

export interface MemberDetailViewProps {
  role: Role;
  memberId: string;
}

/** Fiche membre — informations personnelles, statut, rôle, historique Planning et Comptes rendus. */
export function MemberDetailView({ role, memberId }: MemberDetailViewProps) {
  const permissions = React.useMemo(() => getMemberPermissions(role), [role]);
  const { profile } = useUser();
  const router = useRouter();

  const { data: member, isLoading } = useMember(memberId);
  const { data: assignments = [] } = useMemberAssignments(memberId);
  const { data: reports = [] } = useMemberReports(memberId);

  const acceptMutation = useAcceptMember();
  const refuseMutation = useRefuseMember();
  const suspendMutation = useSuspendMember();
  const reactivateMutation = useReactivateMember();
  const changeRoleMutation = useChangeMemberRole();

  const [confirmAction, setConfirmAction] = React.useState<"suspend" | "refuse" | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (!member) {
    return <MemberEmptyState title="Membre introuvable" description="Ce membre n'existe pas ou vous n'y avez pas accès." />;
  }

  const isOwnProfile = profile?.id === member.id;
  const canAccept = permissions.canValidate && MemberWorkflowService.isAcceptable(member.status);
  const canRefuse = permissions.canRefuse && MemberWorkflowService.isRefusable(member.status);
  const canSuspend = permissions.canSuspend && !isOwnProfile && MemberWorkflowService.isSuspendable(member.status);
  const canReactivate = permissions.canReactivate && MemberWorkflowService.isReactivatable(member.status);
  const canChangeRole = permissions.canChangeRole && !isOwnProfile;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/administration/membres">
          <ArrowLeft className="size-4" />
          Retour aux membres
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AppAvatar name={member.fullName} src={member.photoUrl} className="size-14" />
          <div>
            <AppPageHeader title={member.fullName} description={member.email} />
            <div className="mt-2 flex flex-wrap gap-2">
              <MemberStatusBadge status={member.status} />
              <MemberRoleBadge role={member.role} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {canAccept && (
            <AppButton isLoading={acceptMutation.isPending} onClick={() => profile && acceptMutation.mutate({ id: member.id, adminId: profile.id })}>
              <CheckCircle2 className="size-4" />
              Accepter
            </AppButton>
          )}
          {canRefuse && (
            <AppButton variant="outline" onClick={() => setConfirmAction("refuse")}>
              <XCircle className="size-4" />
              Refuser
            </AppButton>
          )}
          {canSuspend && (
            <AppButton variant="destructive" onClick={() => setConfirmAction("suspend")}>
              <ShieldAlert className="size-4" />
              Suspendre
            </AppButton>
          )}
          {canReactivate && (
            <AppButton variant="outline" isLoading={reactivateMutation.isPending} onClick={() => reactivateMutation.mutate(member.id)}>
              <RotateCcw className="size-4" />
              Réactiver
            </AppButton>
          )}
          {permissions.canChangeEmail && (
            <AppButton variant="outline" onClick={() => setEmailDialogOpen(true)}>
              <Mail className="size-4" />
              Modifier l&apos;e-mail
            </AppButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Informations personnelles</AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">E-mail</p>
                <p className="mt-1 text-sm text-foreground">{member.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Téléphone</p>
                <p className="mt-1 text-sm text-foreground">{member.phone ?? "Non renseigné."}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Date d&apos;inscription</p>
                <p className="mt-1 text-sm text-foreground">{formatDate(member.registeredAt, "d MMMM yyyy")}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rôle</p>
                {canChangeRole ? (
                  <Select
                    value={member.role}
                    onValueChange={(value) => profile && changeRoleMutation.mutate({ id: member.id, role: value as Role, adminId: profile.id })}
                  >
                    <SelectTrigger className="mt-1" aria-label="Modifier le rôle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {ROLE_LABELS[option]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm text-foreground">
                    {ROLE_LABELS[member.role]}
                    {isOwnProfile && " (non modifiable sur votre propre compte)"}
                  </p>
                )}
              </div>
            </AppCardContent>
          </AppCard>

          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Historique Planning</AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="p-0">
              <MemberHistoryList
                items={assignments.map((assignment) => ({
                  id: assignment.id,
                  label: assignment.title,
                  date: assignment.date,
                  statusLabel: PLANNING_STATUS_LABELS_FOR_HISTORY[assignment.status],
                }))}
                emptyLabel="Aucune conduite de créneau pour le moment."
              />
            </AppCardContent>
          </AppCard>

          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Historique des comptes rendus</AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="p-0">
              <MemberHistoryList
                items={reports.map((report) => ({
                  id: report.id,
                  label: report.planningSlotTitle,
                  date: report.date,
                  statusLabel: REPORT_STATUS_LABELS_FOR_HISTORY[report.status],
                }))}
                emptyLabel="Aucun compte rendu rédigé pour le moment."
              />
            </AppCardContent>
          </AppCard>
        </div>

        <AppCard className="p-4">
          <AppCardHeader className="p-0 pb-3">
            <AppCardTitle>Validation</AppCardTitle>
          </AppCardHeader>
          <AppCardContent className="space-y-3 p-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Date de validation</p>
              <p className="mt-1 text-sm text-foreground">{member.validatedAt ? formatDateTime(member.validatedAt) : "Non traitée."}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Administrateur</p>
              <p className="mt-1 text-sm text-foreground">{member.validatedBy?.fullName ?? "—"}</p>
            </div>
          </AppCardContent>
        </AppCard>
      </div>

      <ConfirmDialog
        open={confirmAction === "refuse"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Refuser cette demande d'adhésion ?"
        description={`La demande de « ${member.fullName} » sera marquée comme refusée.`}
        confirmLabel="Refuser"
        isLoading={refuseMutation.isPending}
        onConfirm={async () => {
          if (!profile) return;
          await refuseMutation.mutateAsync({ id: member.id, adminId: profile.id });
          setConfirmAction(null);
        }}
      />

      <ConfirmDialog
        open={confirmAction === "suspend"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Suspendre ce membre ?"
        description={`« ${member.fullName} » ne pourra plus se connecter tant que son compte n'est pas réactivé.`}
        confirmLabel="Suspendre"
        isLoading={suspendMutation.isPending}
        onConfirm={async () => {
          if (!profile) return;
          await suspendMutation.mutateAsync({ id: member.id, adminId: profile.id });
          setConfirmAction(null);
        }}
      />

      <MemberEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        memberId={member.id}
        currentEmail={member.email}
        onUpdated={() => router.refresh()}
      />
    </div>
  );
}
