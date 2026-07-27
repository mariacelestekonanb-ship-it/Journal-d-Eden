import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ENTITY_ICONS, ENTITY_LABELS } from "@/lib/admin/content";
import type { ActivityLogEntry } from "@/lib/admin/types";

export interface ActivityFeedProps {
  entries: ActivityLogEntry[];
}

const UNITES: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

const relatif = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

function formatRelatif(iso: string): string {
  const secondes = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  for (const [unite, seuil] of UNITES) {
    if (Math.abs(secondes) >= seuil) {
      return relatif.format(Math.round(secondes / seuil), unite);
    }
  }
  return relatif.format(secondes, "second");
}

/** Journal d'activité du tableau de bord — voir `lib/admin/activity-log.ts` pour la source (en mémoire, alimentée par les actions génériques). */
export function ActivityFeed({ entries }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <EmptyState
            title="Aucune activité"
            description="Les actions de l'équipe éditoriale apparaîtront ici."
            className="border-none bg-transparent py-8"
          />
        ) : (
          <ol className="space-y-4">
            {entries.map((entry) => {
              const Icon = ENTITY_ICONS[entry.entityType];
              return (
                <li key={entry.id} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="bg-secondary text-navy-900 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full"
                  >
                    <Icon className="size-4" />
                  </span>
                  <p className="min-w-0 flex-1 text-sm leading-snug">
                    <span className="font-medium">{entry.auteur}</span>{" "}
                    <span className="text-muted-foreground">
                      {entry.action}
                    </span>{" "}
                    <Link
                      href={entry.href}
                      className="font-medium hover:underline"
                    >
                      {entry.titre}
                    </Link>
                    <span className="text-muted-foreground block text-xs">
                      {ENTITY_LABELS[entry.entityType]} ·{" "}
                      {formatRelatif(entry.date)}
                    </span>
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
