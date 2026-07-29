import type { Notification, NotificationCallbacks } from "../types/notification.types";
import { buildNotificationGroups } from "../utils/build-notification-groups";
import { NotificationCard } from "./notification-card";
import { NotificationEmptyState } from "./notification-empty-state";

export interface NotificationListProps {
  notifications: Notification[];
  callbacks: NotificationCallbacks;
}

/** Liste chronologique groupée par date (Aujourd'hui / Hier / Cette semaine / Plus ancien). */
export function NotificationList({ notifications, callbacks }: NotificationListProps) {
  if (notifications.length === 0) {
    return <NotificationEmptyState />;
  }

  const groups = buildNotificationGroups(notifications);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.label} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</h3>
          <div className="space-y-2">
            {group.notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} callbacks={callbacks} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
