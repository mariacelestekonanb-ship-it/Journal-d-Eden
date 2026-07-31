import { Trash2 } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent } from "@/shared/components/app-card";
import { formatRelative } from "@/shared/utils/format";

import type { Testimony } from "../types/testimony.types";

export interface TestimonyCardProps {
  testimony: Testimony;
  canDelete: boolean;
  onDelete: (testimony: Testimony) => void;
  className?: string;
}

function TestimonyCardComponent({ testimony, canDelete, onDelete, className }: TestimonyCardProps) {
  return (
    <AppCard className={className}>
      <AppCardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{testimony.title}</p>
          {canDelete && (
            <AppButton
              variant="ghost"
              size="icon"
              aria-label={`Supprimer « ${testimony.title} »`}
              onClick={() => onDelete(testimony)}
            >
              <Trash2 className="size-4 text-destructive" />
            </AppButton>
          )}
        </div>

        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{testimony.content}</p>

        <p className="text-xs text-muted-foreground">
          <span className={testimony.author.isActive === false ? "italic opacity-60" : undefined}>
            {testimony.author.fullName}
          </span>{" "}
          · {formatRelative(testimony.createdAt)}
        </p>
      </AppCardContent>
    </AppCard>
  );
}

/** Une carte de témoignage — titre, contenu, auteur (grisé si le compte a été supprimé), date relative. */
export const TestimonyCard = React.memo(TestimonyCardComponent);
