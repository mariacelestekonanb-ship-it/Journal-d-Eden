"use client";

import { Zap } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import type { Role } from "@/shared/constants/roles";

import { DashboardService } from "../../services/dashboard.service";
import { DashboardCard } from "../dashboard-card";
import { QuickActionCard } from "../quick-action-card";

export interface QuickActionsSectionProps {
  role: Role;
}

/** Section « Actions rapides » : raccourcis adaptés au rôle — aucune action réelle pour l'instant. */
export function QuickActionsSection({ role }: QuickActionsSectionProps) {
  const actions = React.useMemo(() => DashboardService.getQuickActions(role), [role]);

  return (
    <DashboardCard title="Actions rapides" icon={Zap} delay={0.3}>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <QuickActionCard
            key={action.id}
            label={action.label}
            icon={action.icon}
            onClick={() => toast.info("Bientôt disponible")}
          />
        ))}
      </div>
    </DashboardCard>
  );
}
