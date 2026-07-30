"use client";

import { CalendarSearch, Pencil, Trash2, Users } from "lucide-react";

import { AppAvatar } from "@/shared/components/app-avatar";
import { AppButton } from "@/shared/components/app-button";
import { AppCard } from "@/shared/components/app-card";

import type { Program } from "../types/planning.types";

const MAX_VISIBLE_MEMBERS = 4;

export interface ProgramCardProps {
  program: Program;
  canManage: boolean;
  onViewPlanning: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** Une carte programme : description, équipe de conducteurs, raccourci vers son planning filtré. */
export function ProgramCard({ program, canManage, onViewPlanning, onEdit, onDelete }: ProgramCardProps) {
  const visibleMembers = program.members.slice(0, MAX_VISIBLE_MEMBERS);
  const remainingCount = program.members.length - visibleMembers.length;

  return (
    <AppCard className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-foreground">{program.name}</h3>
          {program.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{program.description}</p>}
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-1">
            <AppButton variant="ghost" size="icon" aria-label={`Modifier ${program.name}`} onClick={onEdit}>
              <Pencil className="size-4" />
            </AppButton>
            <AppButton variant="ghost" size="icon" aria-label={`Supprimer ${program.name}`} onClick={onDelete}>
              <Trash2 className="size-4 text-destructive" />
            </AppButton>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        {program.members.length === 0 ? (
          <span className="text-sm text-muted-foreground">Aucun conducteur assigné.</span>
        ) : (
          <div className="flex items-center -space-x-2">
            {visibleMembers.map((member) => (
              <AppAvatar key={member.id} name={member.fullName} className="size-7 border-2 border-background" />
            ))}
            {remainingCount > 0 && (
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                +{remainingCount}
              </span>
            )}
          </div>
        )}
      </div>

      <AppButton variant="outline" size="sm" className="mt-auto" onClick={onViewPlanning}>
        <CalendarSearch className="size-4" />
        Voir le planning
      </AppButton>
    </AppCard>
  );
}
