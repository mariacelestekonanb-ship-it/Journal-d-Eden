"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { NotificationType } from "../types/notification.types";
import { NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_OPTIONS } from "../utils/notification-type";

export interface NotificationTypeBreakdownChartProps {
  byType: Record<NotificationType, number>;
}

/** Répartition des notifications par type — dérivée du cache, aucun appel réseau supplémentaire. */
export function NotificationTypeBreakdownChart({ byType }: NotificationTypeBreakdownChartProps) {
  const data = NOTIFICATION_TYPE_OPTIONS.map((type) => ({ label: NOTIFICATION_TYPE_LABELS[type], count: byType[type] }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} width={28} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--color-foreground)" }}
          formatter={(value) => [`${value}`, "Notifications"]}
        />
        <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
