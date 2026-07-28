import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";

import { NotificationsPanel } from "../components/sections/notifications-panel";
import { QuickActionsSection } from "../components/sections/quick-actions-section";
import { RecentActivitySection } from "../components/sections/recent-activity-section";
import { RecentTopicsSection } from "../components/sections/recent-topics-section";
import { StatsGrid } from "../components/sections/stats-grid";
import { UpcomingSlotsSection } from "../components/sections/upcoming-slots-section";
import { WelcomeHeader } from "../components/sections/welcome-header";

export interface DashboardViewProps {
  profile: CurrentProfile;
}

/**
 * Composition du tableau de bord : message de bienvenue, statistiques,
 * prochaines conduites, derniers sujets, notifications, activité récente et
 * actions rapides. Chaque section gère ses propres données via un hook
 * dédié (voir `features/dashboard/hooks/`) — cette page ne fait
 * qu'assembler la mise en page.
 */
export function DashboardView({ profile }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <WelcomeHeader firstname={profile.firstname} />

      <StatsGrid role={profile.role} userId={profile.id} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UpcomingSlotsSection role={profile.role} userId={profile.id} />
          <RecentTopicsSection />
        </div>
        <div className="space-y-6 lg:col-span-1">
          <NotificationsPanel userId={profile.id} />
          <QuickActionsSection role={profile.role} />
        </div>
      </div>

      <RecentActivitySection />
    </div>
  );
}
