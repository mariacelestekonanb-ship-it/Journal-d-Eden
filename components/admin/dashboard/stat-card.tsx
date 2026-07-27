import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "navy";
}

/** Carte de statistique du tableau de bord — un seul format réutilisé pour tous les compteurs. */
export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        tone === "navy" && "bg-navy-950 border-navy-950 text-white",
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 pt-6">
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-medium",
              tone === "navy" ? "text-gray-300" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums">{value}</p>
          {hint ? (
            <p
              className={cn(
                "mt-1 text-xs",
                tone === "navy" ? "text-gray-400" : "text-muted-foreground",
              )}
            >
              {hint}
            </p>
          ) : null}
        </div>
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            tone === "navy" ? "bg-white/10" : "bg-secondary text-navy-900",
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}
