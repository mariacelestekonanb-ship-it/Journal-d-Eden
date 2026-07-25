import {
  Scale,
  Wrench,
  Landmark,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import type { ImpactAnalyse } from "@/types";

export interface ImpactSectionProps {
  id: string;
  impact: ImpactAnalyse;
}

const GROUPS: { key: keyof ImpactAnalyse; label: string; icon: LucideIcon }[] =
  [
    { key: "juridique", label: "Conséquences juridiques", icon: Scale },
    { key: "pratique", label: "Conséquences pratiques", icon: Wrench },
    {
      key: "institutionnel",
      label: "Conséquences institutionnelles",
      icon: Landmark,
    },
    { key: "economique", label: "Conséquences économiques", icon: TrendingUp },
  ];

/** « Pourquoi cette décision est importante » : les conséquences classées par nature. */
export function ImpactSection({ id, impact }: ImpactSectionProps) {
  const groups = GROUPS.filter((group) => (impact[group.key]?.length ?? 0) > 0);

  if (groups.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Heading id={`${id}-heading`} as="h2" size="md">
        Pourquoi cette décision est importante
      </Heading>
      <div
        className={cn("mt-6 grid gap-5", groups.length > 1 && "sm:grid-cols-2")}
      >
        {groups.map((group) => {
          const points = impact[group.key] ?? [];
          const Icon = group.icon;

          return (
            <div
              key={group.key}
              className="border-border bg-card rounded-2xl border p-6"
            >
              <div className="flex items-center gap-2.5">
                <Icon aria-hidden className="text-accent size-5" />
                <p className="font-heading text-foreground text-sm font-semibold">
                  {group.label}
                </p>
              </div>
              <ul className="mt-4 space-y-2.5">
                {points.map((point, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex gap-2 text-sm leading-relaxed"
                  >
                    <span aria-hidden className="text-accent">
                      —
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
