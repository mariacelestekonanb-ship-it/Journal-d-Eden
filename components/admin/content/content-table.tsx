import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export interface ContentTableColumn<T> {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

export interface ContentTableProps<T> {
  items: T[];
  columns: ContentTableColumn<T>[];
  getRowKey: (item: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Tableau générique des pages de liste de l'admin : une seule
 * implémentation, paramétrée par colonnes, réutilisée par les cinq
 * modules (fiches, veille, glossaire, ressources, catégories). Défilement
 * horizontal sur petit écran plutôt qu'un empilement en cartes, pour
 * conserver une vraie sémantique `<table>` (accessible aux lecteurs
 * d'écran) quelle que soit la largeur d'écran.
 */
export function ContentTable<T>({
  items,
  columns,
  getRowKey,
  emptyTitle = "Aucun résultat",
  emptyDescription = "Aucun contenu ne correspond à ces filtres pour le moment.",
}: ContentTableProps<T>) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="border-border bg-muted/40 border-b">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={cn(
                  "text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {items.map((item) => (
            <tr
              key={getRowKey(item)}
              className="hover:bg-muted/30 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={cn("px-4 py-3 align-middle", column.className)}
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
