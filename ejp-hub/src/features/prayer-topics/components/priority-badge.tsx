import { Badge } from "@/shared/components/ui/badge";
import type { TopicPriority } from "@/types/database";

const PRIORITY_CONFIG: Record<TopicPriority, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
  haute: { label: "Haute", variant: "destructive" },
  moyenne: { label: "Moyenne", variant: "warning" },
  basse: { label: "Basse", variant: "secondary" },
};

export function PriorityBadge({ priority }: { priority: TopicPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
