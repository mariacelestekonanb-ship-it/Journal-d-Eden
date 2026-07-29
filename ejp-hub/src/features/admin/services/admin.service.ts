import { MemberService } from "@/features/members";
import { NotificationService } from "@/features/notifications";
import { PlanningService } from "@/features/planning";
import { PrayerTopicService } from "@/features/prayer-topics";
import { ReportService } from "@/features/reports";

import { getAdminRepository } from "../repositories/admin-repository";
import type { AdminCategory, AdminDashboardStats, AdminSearchResult } from "../types/admin.types";
import type { AdminCategoryFormValues } from "../validation/admin-category.schema";

/**
 * Point d'entrée pour les données propres à l'Administration (tableau de
 * bord agrégé, recherche globale, catégories). Contrairement aux autres
 * `*Service` du projet, celui-ci ne relit **jamais** directement les tables
 * des autres modules : il appelle leurs services publics
 * (`MemberService`, `ReportService`, `PlanningService`,
 * `PrayerTopicService`, `NotificationService`), exactement comme le ferait
 * n'importe quel autre composant client — aucune donnée dupliquée, aucun
 * accès Supabase supplémentaire à maintenir.
 */
function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export const AdminService = {
  /** Les 7 indicateurs du tableau de bord — un seul aller-retour par module producteur. */
  async getDashboardStats(adminId: string): Promise<AdminDashboardStats> {
    const context = { userId: adminId, role: "ADMIN" as const };

    const [members, slots, reports, topics, notifications] = await Promise.all([
      MemberService.list(context),
      PlanningService.list(),
      ReportService.list(context),
      PrayerTopicService.list(),
      NotificationService.list(context),
    ]);

    const today = todayIsoDate();

    return {
      totalMembers: members.length,
      activeLeaders: members.filter((member) => member.role === "PRAYER_LEADER" && member.status === "ACTIVE").length,
      pendingMembershipRequests: members.filter((member) => member.status === "PENDING").length,
      scheduledSlots: slots.filter((slot) => slot.date >= today).length,
      pendingReports: reports.filter((report) => report.status === "SUBMITTED").length,
      activePrayerTopics: topics.filter((topic) => topic.status === "ACTIVE").length,
      unreadNotifications: notifications.filter((notification) => !notification.isRead).length,
    };
  },

  /**
   * Recherche globale — interroge les mêmes services publics que le
   * tableau de bord, filtre en mémoire. Architecture extensible : ajouter
   * un module cherchable se résume à un nouvel appel `Promise.all` et un
   * nouveau `AdminSearchResultType`.
   */
  async search(query: string, adminId: string): Promise<AdminSearchResult[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const context = { userId: adminId, role: "ADMIN" as const };
    const [members, reports, topics, slots] = await Promise.all([
      MemberService.list(context),
      ReportService.list(context),
      PrayerTopicService.list(),
      PlanningService.list(),
    ]);

    const results: AdminSearchResult[] = [];

    members.forEach((member) => {
      if (`${member.fullName} ${member.email}`.toLowerCase().includes(trimmed)) {
        results.push({
          id: member.id,
          type: "MEMBER",
          title: member.fullName,
          subtitle: member.email,
          url: `/administration/membres/${member.id}`,
        });
      }
    });

    reports.forEach((report) => {
      if (`${report.planningSlot.title} ${report.announcements}`.toLowerCase().includes(trimmed)) {
        results.push({
          id: report.id,
          type: "REPORT",
          title: report.planningSlot.title,
          subtitle: null,
          url: `/comptes-rendus/${report.id}`,
        });
      }
    });

    topics.forEach((topic) => {
      if (`${topic.title} ${topic.description ?? ""}`.toLowerCase().includes(trimmed)) {
        results.push({ id: topic.id, type: "PRAYER_TOPIC", title: topic.title, subtitle: null, url: "/sujets-de-priere" });
      }
    });

    slots.forEach((slot) => {
      if (`${slot.title} ${slot.location ?? ""}`.toLowerCase().includes(trimmed)) {
        results.push({ id: slot.id, type: "PLANNING", title: slot.title, subtitle: slot.location, url: "/planning" });
      }
    });

    return results.slice(0, 20);
  },

  async listCategories(): Promise<AdminCategory[]> {
    return getAdminRepository().listCategories();
  },

  async createCategory(values: AdminCategoryFormValues): Promise<AdminCategory> {
    return getAdminRepository().createCategory(values);
  },

  async updateCategory(id: string, values: AdminCategoryFormValues): Promise<AdminCategory> {
    return getAdminRepository().updateCategory(id, values);
  },

  async removeCategory(id: string): Promise<void> {
    return getAdminRepository().removeCategory(id);
  },
};
