import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/admin/content/status-badge";
import {
  ENTITY_ICONS,
  ENTITY_LABELS,
  type AdminContentSummary,
} from "@/lib/admin/content";
import { formatDate } from "@/lib/format";

export interface RecentContentListProps {
  items: AdminContentSummary[];
}

/** Contenus récemment modifiés, tous modules confondus — trié par date de mise à jour côté appelant. */
export function RecentContentList({ items }: RecentContentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Récemment modifié</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="Aucun contenu"
            description="Rien n'a encore été modifié."
            className="border-none bg-transparent py-8"
          />
        ) : (
          <ul className="divide-border -mx-2 divide-y">
            {items.map((item) => {
              const Icon = ENTITY_ICONS[item.entity];
              return (
                <li key={`${item.entity}-${item.id}`}>
                  <Link
                    href={item.href}
                    className="hover:bg-secondary focus-visible:ring-ring flex items-center gap-3 rounded-xl px-2 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span
                      aria-hidden
                      className="bg-secondary text-navy-900 flex size-8 shrink-0 items-center justify-center rounded-full"
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-foreground block truncate text-sm font-medium">
                        {item.titre}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {ENTITY_LABELS[item.entity]} ·{" "}
                        {formatDate(item.updatedAt)} · {item.updatedBy}
                      </span>
                    </span>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
