import { isSupabaseConfigured } from "@/shared/lib/supabase/config";
import type { Role } from "@/shared/constants/roles";

import { DashboardMocks } from "../data/dashboard.mocks";
import type {
  ActivityLogEntry,
  DashboardNotification,
  DashboardStat,
  QuickAction,
  RecentPrayerTopicSummary,
  UpcomingSlotSummary,
} from "../types/dashboard.types";
import { DashboardMapper } from "./dashboard.mapper";
import {
  markAllNotificationsReadQuery,
  markNotificationReadQuery,
  queryActiveTopicsCount,
  queryMySlotsThisWeekCount,
  queryMyUnreadNotificationsCount,
  queryMyUpcomingSlotsCount,
  queryNotifications,
  queryPendingReportsCount,
  queryPrayerLeadersCount,
  queryPublishedTestimoniesCount,
  queryRecentActivityRows,
  queryRecentPrayerTopics,
  queryUpcomingSlots,
} from "./dashboard.queries";
import { ADMIN_STATS_CONFIG, PRAYER_LEADER_STATS_CONFIG } from "./dashboard.stats-config";

const UPCOMING_SLOTS_LIMIT = 3;
const RECENT_TOPICS_LIMIT = 5;
const NOTIFICATIONS_LIMIT = 10;
const RECENT_ACTIVITY_LIMIT = 6;

/**
 * Point d'entrée unique pour toute donnée du tableau de bord. Les
 * composants et hooks ne connaissent que cette interface — jamais
 * `dashboard.queries.ts` ni le client Supabase directement.
 *
 * Tant que Supabase n'est pas configuré, chaque méthode retourne des
 * données fictives (`DashboardMocks`) structurées exactement comme les
 * vraies données, pour que le passage à une base réelle ne change aucun
 * composant.
 */
export const DashboardService = {
  async getStats(params: { role: Role; userId: string }): Promise<DashboardStat[]> {
    if (!isSupabaseConfigured()) {
      return params.role === "ADMIN" ? DashboardMocks.statsForAdmin() : DashboardMocks.statsForPrayerLeader();
    }

    if (params.role === "ADMIN") {
      const [prayerLeaders, activeTopics, pendingReports, testimonies] = await Promise.all([
        queryPrayerLeadersCount(),
        queryActiveTopicsCount(),
        queryPendingReportsCount(),
        queryPublishedTestimoniesCount(),
      ]);
      const values = [prayerLeaders, activeTopics, pendingReports, testimonies];
      return ADMIN_STATS_CONFIG.map((stat, index) => ({ ...stat, value: values[index] ?? 0 }));
    }

    const [slotsThisWeek, pendingReports, unreadNotifications, upcomingSlots] = await Promise.all([
      queryMySlotsThisWeekCount(params.userId),
      queryPendingReportsCount(params.userId),
      queryMyUnreadNotificationsCount(params.userId),
      queryMyUpcomingSlotsCount(params.userId),
    ]);
    const values = [slotsThisWeek, pendingReports, unreadNotifications, upcomingSlots];
    return PRAYER_LEADER_STATS_CONFIG.map((stat, index) => ({ ...stat, value: values[index] ?? 0 }));
  },

  async getUpcomingSlots(params: { role: Role; userId: string }): Promise<UpcomingSlotSummary[]> {
    if (!isSupabaseConfigured()) {
      return DashboardMocks.upcomingSlots();
    }

    const rows = await queryUpcomingSlots({
      prayerLeaderId: params.role === "PRAYER_LEADER" ? params.userId : undefined,
      limit: UPCOMING_SLOTS_LIMIT,
    });
    return rows.map(DashboardMapper.toUpcomingSlotSummary);
  },

  async getRecentPrayerTopics(): Promise<RecentPrayerTopicSummary[]> {
    if (!isSupabaseConfigured()) {
      return DashboardMocks.recentPrayerTopics();
    }

    const rows = await queryRecentPrayerTopics(RECENT_TOPICS_LIMIT);
    return rows.map(DashboardMapper.toRecentPrayerTopicSummary);
  },

  async getNotifications(userId: string): Promise<DashboardNotification[]> {
    if (!isSupabaseConfigured()) {
      return DashboardMocks.notifications();
    }

    const rows = await queryNotifications(userId, NOTIFICATIONS_LIMIT);
    return rows.map(DashboardMapper.toDashboardNotification);
  },

  async markNotificationAsRead(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      DashboardMocks.markNotificationAsRead(id);
      return;
    }
    await markNotificationReadQuery(id);
  },

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      DashboardMocks.markAllNotificationsAsRead();
      return;
    }
    await markAllNotificationsReadQuery(userId);
  },

  async getRecentActivity(): Promise<ActivityLogEntry[]> {
    if (!isSupabaseConfigured()) {
      return DashboardMocks.recentActivity();
    }

    const { reports, testimonies, topics } = await queryRecentActivityRows(RECENT_ACTIVITY_LIMIT);
    const entries = [
      ...reports.map(DashboardMapper.reportRowToActivity),
      ...testimonies.map(DashboardMapper.testimonyRowToActivity),
      ...topics.map(DashboardMapper.topicRowToActivity),
    ];

    return entries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, RECENT_ACTIVITY_LIMIT);
  },

  getQuickActions(role: Role): QuickAction[] {
    return role === "ADMIN" ? DashboardMocks.quickActionsForAdmin() : DashboardMocks.quickActionsForPrayerLeader();
  },
};
