import { formatDate } from "@/shared/utils/format";

export interface MemberHistoryItem {
  id: string;
  label: string;
  date: string;
  statusLabel: string;
}

export interface MemberHistoryListProps {
  items: MemberHistoryItem[];
  emptyLabel: string;
}

/** Liste compacte réutilisée pour l'historique Planning et l'historique Comptes rendus d'un membre. */
export function MemberHistoryList({ items, emptyLabel }: MemberHistoryListProps) {
  if (items.length === 0) {
    return <p className="text-sm italic text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3 text-sm"
        >
          <div>
            <p className="font-medium text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground">{formatDate(item.date, "d MMM yyyy")}</p>
          </div>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">{item.statusLabel}</span>
        </li>
      ))}
    </ul>
  );
}
