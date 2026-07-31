"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { ResetPasswordForm, useUser } from "@/features/auth";
import { AppAvatar } from "@/shared/components/app-avatar";
import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { ROLE_LABELS } from "@/shared/constants/roles";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate } from "@/shared/utils/format";

import { MemberEmptyState } from "../components/member-empty-state";
import { MemberHistoryList } from "../components/member-history-list";
import { MemberRoleBadge } from "../components/member-role-badge";
import { MemberStatusBadge } from "../components/member-status-badge";
import { useUpdateOwnProfile } from "../hooks/use-member-mutations";
import { useMember, useMemberAssignments, useMemberReports } from "../hooks/use-members";
import { PLANNING_STATUS_LABELS_FOR_HISTORY, REPORT_STATUS_LABELS_FOR_HISTORY } from "../utils/member-history-labels";
import { memberProfileSchema, type MemberProfileFormValues } from "../validation/member-profile.schema";

/**
 * Page « Mon profil » — chaque membre modifie sa photo et son téléphone,
 * change son mot de passe (formulaire réutilisé tel quel depuis le module
 * Auth) et consulte son propre historique. L'e-mail n'est pas modifiable ici
 * (réservé à un administrateur, voir `MemberEmailDialog`).
 */
export function MemberSelfProfileView() {
  const { profile, isLoading: isProfileLoading } = useUser();
  const { data: member, isLoading: isMemberLoading } = useMember(profile?.id);
  const { data: assignments = [] } = useMemberAssignments(profile?.id);
  const { data: reports = [] } = useMemberReports(profile?.id);
  const updateMutation = useUpdateOwnProfile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MemberProfileFormValues>({
    resolver: zodResolver(memberProfileSchema),
    values: { phone: member?.phone ?? "" },
  });

  if (isProfileLoading || isMemberLoading) return <Skeleton className="h-64 w-full" />;

  if (!member) {
    return <MemberEmptyState title="Profil introuvable" description="Impossible de charger votre profil pour le moment." />;
  }

  async function onSubmit(values: MemberProfileFormValues) {
    await updateMutation.mutateAsync({ id: member!.id, values: { phone: values.phone }, photo: values.photo });
  }

  return (
    <div className="space-y-6">
      <AppPageHeader title="Mon profil" description="Gérez vos informations personnelles et votre sécurité." />

      <div className="flex items-center gap-3">
        <AppAvatar name={member.fullName} src={member.photoUrl} className="size-14" />
        <div>
          <p className="text-lg font-semibold text-foreground">{member.fullName}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <MemberStatusBadge status={member.status} deletedAt={member.deletedAt} />
            <MemberRoleBadge role={member.role} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Informations personnelles</AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="space-y-4 p-0">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">E-mail</p>
                <p className="mt-1 text-sm text-foreground">{member.email}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Modifiable uniquement par un administrateur.</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rôle</p>
                <p className="mt-1 text-sm text-foreground">{ROLE_LABELS[member.role]}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Membre depuis</p>
                <p className="mt-1 text-sm text-foreground">{formatDate(member.registeredAt, "d MMMM yyyy")}</p>
              </div>
            </AppCardContent>
          </AppCard>

          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Modifier mon profil</AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" aria-invalid={!!errors.phone} {...register("phone")} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Photo</Label>
                  <Controller
                    control={control}
                    name="photo"
                    render={({ field: { onChange, onBlur, ref, name } }) => (
                      <Input
                        id="photo"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        onChange={(event) => onChange(event.target.files?.[0])}
                      />
                    )}
                  />
                  {errors.photo && <p className="text-xs text-destructive">{errors.photo.message as string}</p>}
                </div>

                <AppButton type="submit" isLoading={updateMutation.isPending}>
                  Enregistrer
                </AppButton>
              </form>
            </AppCardContent>
          </AppCard>

          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Sécurité</AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="p-0">
              <ResetPasswordForm />
            </AppCardContent>
          </AppCard>
        </div>

        <div className="space-y-6">
          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Mon historique Planning</AppCardTitle>
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
              <AppCardTitle>Mes comptes rendus</AppCardTitle>
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
      </div>
    </div>
  );
}
