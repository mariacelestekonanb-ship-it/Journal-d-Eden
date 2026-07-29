import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import * as React from "react";

import { AppAvatar } from "@/shared/components/app-avatar";
import { AppCard, AppCardContent } from "@/shared/components/app-card";
import { formatRelative } from "@/shared/utils/format";

import type { Member } from "../types/member.types";
import { MemberRoleBadge } from "./member-role-badge";
import { MemberStatusBadge } from "./member-status-badge";

export interface MemberCardProps {
  member: Member;
  /** Zone d'actions optionnelle (ex. Accepter/Refuser sur la page des demandes). */
  actions?: ReactNode;
  className?: string;
}

function MemberCardComponent({ member, actions, className }: MemberCardProps) {
  return (
    <AppCard className={className}>
      <AppCardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <AppAvatar name={member.fullName} src={member.photoUrl} className="size-11 shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{member.fullName}</p>
            <p className="text-xs text-muted-foreground">Inscrit {formatRelative(member.registeredAt)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <MemberStatusBadge status={member.status} />
          <MemberRoleBadge role={member.role} />
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Mail className="size-3.5 shrink-0" aria-hidden="true" />
            {member.email}
          </p>
          {member.phone && (
            <p className="flex items-center gap-1.5">
              <Phone className="size-3.5 shrink-0" aria-hidden="true" />
              {member.phone}
            </p>
          )}
        </div>

        {actions && <div className="flex flex-wrap justify-end gap-2 pt-1">{actions}</div>}
      </AppCardContent>
    </AppCard>
  );
}

/** Carte compacte d'un membre — informations essentielles, réutilisable (demandes, futures vues cartes). */
export const MemberCard = React.memo(MemberCardComponent);
