import { Circle } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { AdminStatus } from "@/lib/admin/types";

const STATUS_CONFIG: Record<
  AdminStatus,
  { label: string; variant: BadgeProps["variant"]; dot: string }
> = {
  brouillon: {
    label: "Brouillon",
    variant: "default",
    dot: "text-muted-foreground",
  },
  "en-relecture": {
    label: "En relecture",
    variant: "accent",
    dot: "text-gold-600",
  },
  "a-corriger": {
    label: "À corriger",
    variant: "danger",
    dot: "text-destructive",
  },
  publie: { label: "Publié", variant: "success", dot: "text-success" },
  archive: {
    label: "Archivé",
    variant: "outline",
    dot: "text-muted-foreground",
  },
};

export interface StatusBadgeProps {
  status: AdminStatus;
}

/** Pastille de statut éditorial — un seul composant pour tout le back-office, garantissant la même palette partout. */
export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant}>
      <Circle className={`size-2 ${config.dot} fill-current`} aria-hidden />
      {config.label}
    </Badge>
  );
}
