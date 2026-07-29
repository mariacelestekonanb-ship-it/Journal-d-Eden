"use client";

import * as React from "react";

import { useUser } from "@/features/auth/hooks/use-user";
import { AppButton } from "@/shared/components/app-button";
import { Textarea } from "@/shared/ui/textarea";
import { formatDateTime } from "@/shared/utils/format";
import { getFullName } from "@/shared/utils/get-full-name";

import { useAddComment } from "../hooks/use-report-mutations";
import type { ReportComment } from "../types/report.types";

export interface ReportCommentsProps {
  reportId: string;
  comments: ReportComment[];
  /** Seul un admin peut ajouter un commentaire (retour au conducteur) — voir `getReportPermissions`. */
  canComment: boolean;
}

/** Fil de commentaires de suivi (retour admin) sur un compte rendu. */
export function ReportComments({ reportId, comments, canComment }: ReportCommentsProps) {
  const { profile } = useUser();
  const [message, setMessage] = React.useState("");
  const addComment = useAddComment();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!profile || !message.trim()) return;
    addComment.mutate(
      { reportId, author: { id: profile.id, fullName: getFullName(profile) }, message: message.trim() },
      { onSuccess: () => setMessage("") },
    );
  }

  return (
    <div className="space-y-3">
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun commentaire pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{comment.authorName}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{comment.message}</p>
            </li>
          ))}
        </ul>
      )}

      {canComment && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ajouter un commentaire pour le conducteur…"
            rows={3}
            aria-label="Nouveau commentaire"
          />
          <AppButton type="submit" size="sm" isLoading={addComment.isPending} disabled={!message.trim()}>
            Envoyer
          </AppButton>
        </form>
      )}
    </div>
  );
}
