"use client";

import * as React from "react";
import { History, RotateCcw, GitCompareArrows } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/admin/content/confirm-dialog";
import { RevisionCompare } from "@/components/admin/revisions/revision-compare";
import { formatDate } from "@/lib/format";
import type { Revision } from "@/lib/admin/types";

export interface RevisionHistoryProps {
  versions: Revision[];
}

/**
 * Historique des versions d'un contenu : liste, sélection de deux versions
 * à comparer, restauration. Aucun stockage réel — `versions` vient des
 * données factices de `lib/admin/seed.ts` et une restauration ne modifie
 * rien tant qu'une source de données réelle n'est pas connectée (voir
 * `RevisionCompare` pour la même limitation appliquée à la comparaison).
 */
export function RevisionHistory({ versions }: RevisionHistoryProps) {
  const [selection, setSelection] = React.useState<string[]>([]);
  const [restoreTarget, setRestoreTarget] = React.useState<Revision | null>(
    null,
  );

  function toggleSelection(id: string) {
    setSelection((current) => {
      if (current.includes(id)) return current.filter((v) => v !== id);
      if (current.length === 2) return [current[1], id];
      return [...current, id];
    });
  }

  if (versions.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Aucun historique"
        description="Les révisions apparaîtront ici au fil des modifications de ce contenu."
      />
    );
  }

  const comparees = versions.filter((v) => selection.includes(v.id));

  return (
    <div className="space-y-4">
      <ol className="border-border divide-border divide-y overflow-hidden rounded-2xl border">
        {versions.map((version, index) => (
          <li key={version.id} className="flex items-center gap-3 px-4 py-3">
            <input
              type="checkbox"
              checked={selection.includes(version.id)}
              onChange={() => toggleSelection(version.id)}
              className="accent-navy-900 size-4 shrink-0"
              aria-label={`Sélectionner la version du ${formatDate(version.date)} pour comparaison`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {version.resume}
                {index === 0 ? (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · version actuelle
                  </span>
                ) : null}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDate(version.date)} · {version.auteur}
              </p>
            </div>
            {index !== 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRestoreTarget(version)}
              >
                <RotateCcw aria-hidden />
                Restaurer
              </Button>
            ) : null}
          </li>
        ))}
      </ol>

      {comparees.length === 2 ? (
        <RevisionCompare a={comparees[0]} b={comparees[1]} />
      ) : (
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <GitCompareArrows className="size-3.5" aria-hidden />
          Cochez deux versions pour les comparer.
        </p>
      )}

      <ConfirmDialog
        open={restoreTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
        title="Restaurer cette version ?"
        description="Architecture de démonstration : aucun contenu réel n'est conservé par version. La restauration ne modifiera donc rien tant qu'une source de données réelle n'est pas connectée."
        confirmLabel="Restaurer"
        onConfirm={() => setRestoreTarget(null)}
      />
    </div>
  );
}
