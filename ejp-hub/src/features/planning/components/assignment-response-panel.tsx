"use client";

import { Check, UserRoundX, X } from "lucide-react";
import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";
import { AppButton } from "@/shared/components/app-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { formatDateTime } from "@/shared/utils/format";

import { useRespondToAssignment } from "../hooks/use-planning-mutations";
import { usePlanningLeaderOptions } from "../hooks/use-planning-slots";
import {
  useCancelReplacementRequest,
  useCreateReplacementRequest,
  useDecideReplacementRequest,
  useReplacementRequests,
} from "../hooks/use-replacement-requests";
import type { PlanningLeaderRole, PrayerSlot } from "../types/planning.types";
import { ASSIGNMENT_RESPONSE_BADGE_VARIANT, ASSIGNMENT_RESPONSE_LABELS } from "../utils/assignment-response";

export interface AssignmentResponsePanelProps {
  slot: PrayerSlot;
  currentUserId: string;
  isAdmin: boolean;
}

interface RoleAssignment {
  role: PlanningLeaderRole;
  label: string;
  leaderId: string | null;
  leaderName: string | null;
  response: PrayerSlot["prayerLeaderResponse"];
  comment: string | null;
  respondedAt: string | null;
}

function toRoleAssignments(slot: PrayerSlot): RoleAssignment[] {
  const assignments: RoleAssignment[] = [
    {
      role: "PRAYER_LEADER",
      label: "Conducteur principal",
      leaderId: slot.primaryLeader?.id ?? null,
      leaderName: slot.primaryLeader?.fullName ?? null,
      response: slot.prayerLeaderResponse,
      comment: slot.prayerLeaderResponseComment,
      respondedAt: slot.prayerLeaderResponseAt,
    },
    {
      role: "SECONDARY_LEADER",
      label: "Conducteur secondaire",
      leaderId: slot.secondaryLeader?.id ?? null,
      leaderName: slot.secondaryLeader?.fullName ?? null,
      response: slot.secondaryLeaderResponse,
      comment: slot.secondaryLeaderResponseComment,
      respondedAt: slot.secondaryLeaderResponseAt,
    },
  ];
  return assignments.filter((assignment) => assignment.leaderId);
}

/** Accepter/refuser sa propre assignation, avec commentaire — la décision reste modifiable à tout moment. */
function MyResponseForm({ slot, assignment }: { slot: PrayerSlot; assignment: RoleAssignment }) {
  const [comment, setComment] = React.useState(assignment.comment ?? "");
  const respondMutation = useRespondToAssignment();

  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Votre réponse — {assignment.label.toLowerCase()}</p>
        <AppBadge variant={ASSIGNMENT_RESPONSE_BADGE_VARIANT[assignment.response]}>
          {ASSIGNMENT_RESPONSE_LABELS[assignment.response]}
        </AppBadge>
      </div>
      <Textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Commentaire (optionnel)"
        rows={2}
      />
      <div className="flex flex-wrap gap-2">
        <AppButton
          size="sm"
          variant={assignment.response === "ACCEPTED" ? "default" : "outline"}
          disabled={respondMutation.isPending}
          onClick={() =>
            respondMutation.mutate({ id: slot.id, role: assignment.role, values: { response: "ACCEPTED", comment } })
          }
        >
          <Check className="size-4" />
          Accepter
        </AppButton>
        <AppButton
          size="sm"
          variant={assignment.response === "DECLINED" ? "destructive" : "outline"}
          disabled={respondMutation.isPending}
          onClick={() =>
            respondMutation.mutate({ id: slot.id, role: assignment.role, values: { response: "DECLINED", comment } })
          }
        >
          <X className="size-4" />
          Refuser
        </AppButton>
      </div>
      <p className="text-xs text-muted-foreground">Vous pouvez changer d&apos;avis à tout moment.</p>
    </div>
  );
}

/** Formulaire de proposition d'un remplaçant précis pour ce créneau (validation admin requise). */
function ReplacementRequestForm({
  slot,
  assignment,
  currentUserId,
  onDone,
}: {
  slot: PrayerSlot;
  assignment: RoleAssignment;
  currentUserId: string;
  onDone: () => void;
}) {
  const { data: leaders } = usePlanningLeaderOptions();
  const [proposedMemberId, setProposedMemberId] = React.useState("");
  const [comment, setComment] = React.useState("");
  const createMutation = useCreateReplacementRequest(slot.id);

  const candidates = (leaders ?? []).filter((leader) => leader.id !== currentUserId);

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
      <p className="text-sm font-medium text-foreground">Proposer un remplaçant — {assignment.label.toLowerCase()}</p>
      <Select value={proposedMemberId} onValueChange={setProposedMemberId}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir un membre" />
        </SelectTrigger>
        <SelectContent>
          {candidates.map((leader) => (
            <SelectItem key={leader.id} value={leader.id}>
              {leader.fullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Pourquoi ce remplacement ? (optionnel)"
        rows={2}
      />
      <div className="flex flex-wrap gap-2">
        <AppButton
          size="sm"
          disabled={!proposedMemberId || createMutation.isPending}
          onClick={() =>
            createMutation.mutate(
              { role: assignment.role, requestedBy: currentUserId, proposedMemberId, comment: comment || null },
              { onSuccess: onDone },
            )
          }
        >
          Envoyer la demande
        </AppButton>
        <AppButton size="sm" variant="ghost" onClick={onDone}>
          Annuler
        </AppButton>
      </div>
    </div>
  );
}

const REPLACEMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de validation",
  APPROVED: "Approuvée",
  REJECTED: "Refusée",
};

const REPLACEMENT_STATUS_VARIANT: Record<string, NonNullable<React.ComponentProps<typeof AppBadge>["variant"]>> = {
  PENDING: "secondary",
  APPROVED: "success",
  REJECTED: "destructive",
};

/** Panneau complet affiché dans le détail d'un créneau : état des réponses, actions du conducteur assigné, décisions admin. */
export function AssignmentResponsePanel({ slot, currentUserId, isAdmin }: AssignmentResponsePanelProps) {
  const assignments = React.useMemo(() => toRoleAssignments(slot), [slot]);
  const myAssignments = assignments.filter((assignment) => assignment.leaderId === currentUserId);
  const [replacementFormRole, setReplacementFormRole] = React.useState<PlanningLeaderRole | null>(null);

  const { data: replacementRequests } = useReplacementRequests(slot.id);
  const decideMutation = useDecideReplacementRequest(slot.id);
  const cancelMutation = useCancelReplacementRequest(slot.id);

  if (assignments.length === 0) return null;

  return (
    <div className="space-y-3 border-t border-border pt-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Réponse à l&apos;assignation</p>

      <div className="space-y-2">
        {assignments.map((assignment) => (
          <div key={assignment.role} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-foreground">
              {assignment.label} · {assignment.leaderName}
            </span>
            <div className="flex items-center gap-2">
              <AppBadge variant={ASSIGNMENT_RESPONSE_BADGE_VARIANT[assignment.response]}>
                {ASSIGNMENT_RESPONSE_LABELS[assignment.response]}
              </AppBadge>
            </div>
          </div>
        ))}
        {assignments
          .filter((assignment) => assignment.response === "DECLINED" && assignment.comment)
          .map((assignment) => (
            <p key={`${assignment.role}-comment`} className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
              « {assignment.comment} »
            </p>
          ))}
      </div>

      {myAssignments.map((assignment) => (
        <div key={assignment.role} className="space-y-2">
          <MyResponseForm slot={slot} assignment={assignment} />
          {replacementFormRole === assignment.role ? (
            <ReplacementRequestForm
              slot={slot}
              assignment={assignment}
              currentUserId={currentUserId}
              onDone={() => setReplacementFormRole(null)}
            />
          ) : (
            <AppButton size="sm" variant="ghost" onClick={() => setReplacementFormRole(assignment.role)}>
              <UserRoundX className="size-4" />
              Signaler un remplacement
            </AppButton>
          )}
        </div>
      ))}

      {(replacementRequests?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Demandes de remplacement</p>
          {replacementRequests!.map((request) => (
            <div key={request.id} className="space-y-1.5 rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground">
                  {request.requestedBy.fullName} → {request.proposedMember.fullName}
                </span>
                <AppBadge variant={REPLACEMENT_STATUS_VARIANT[request.status]}>
                  {REPLACEMENT_STATUS_LABELS[request.status]}
                </AppBadge>
              </div>
              {request.comment && <p className="text-xs text-muted-foreground">« {request.comment} »</p>}
              <p className="text-xs text-muted-foreground">{formatDateTime(request.createdAt)}</p>
              {request.status === "PENDING" && isAdmin && (
                <div className="flex gap-2 pt-1">
                  <AppButton
                    size="sm"
                    disabled={decideMutation.isPending}
                    onClick={() => decideMutation.mutate({ id: request.id, decision: "APPROVED", decidedBy: currentUserId })}
                  >
                    Approuver
                  </AppButton>
                  <AppButton
                    size="sm"
                    variant="outline"
                    disabled={decideMutation.isPending}
                    onClick={() => decideMutation.mutate({ id: request.id, decision: "REJECTED", decidedBy: currentUserId })}
                  >
                    Refuser
                  </AppButton>
                </div>
              )}
              {request.status === "PENDING" && !isAdmin && request.requestedBy.id === currentUserId && (
                <AppButton
                  size="sm"
                  variant="ghost"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(request.id)}
                >
                  Annuler la demande
                </AppButton>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
