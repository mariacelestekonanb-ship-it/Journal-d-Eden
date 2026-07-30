import { getFullName } from "@/shared/utils/get-full-name";

import { ReportMapper } from "../mappers/report.mapper";
import {
  createReportCommentQuery,
  createReportQuery,
  deleteReportQuery,
  queryAllReports,
  queryAvailablePlanningSlots,
  queryReportComments,
  updateReportQuery,
  updateReportStatusQuery,
} from "../queries/report.queries";
import type { ReportRepository } from "./report-repository";

/**
 * Implémentation réelle de `ReportRepository`, branchée sur Supabase.
 * Utilisée dès que `isSupabaseConfigured()` renvoie `true` (voir
 * `getRepository()` dans `report.service.ts`).
 *
 * L'isolation par rôle (`ReportListContext`) n'a pas besoin d'être
 * reproduite ici : la Row Level Security de `reports` applique déjà la même
 * règle (`auth.uid() = created_by or is_admin()`) côté base.
 */
export const SupabaseReportRepository: ReportRepository = {
  async list() {
    const rows = await queryAllReports();
    return rows.map(ReportMapper.toReport);
  },

  async getById(id) {
    const rows = await queryAllReports();
    const row = rows.find((candidate) => candidate.id === id);
    return row ? ReportMapper.toReport(row) : null;
  },

  async create(values, slotId, leader, author) {
    const row = await createReportQuery(values, slotId, leader.id, author.id);
    return ReportMapper.toReport(row);
  },

  async update(id, values) {
    const row = await updateReportQuery(id, values);
    return ReportMapper.toReport(row);
  },

  async submit(id) {
    const row = await updateReportStatusQuery(id, { status: "SUBMITTED", submittedAt: new Date().toISOString() });
    return ReportMapper.toReport(row);
  },

  async validate(id) {
    const row = await updateReportStatusQuery(id, { status: "VALIDATED", validatedAt: new Date().toISOString() });
    return ReportMapper.toReport(row);
  },

  async reject(id) {
    const row = await updateReportStatusQuery(id, { status: "REJECTED", validatedAt: null });
    return ReportMapper.toReport(row);
  },

  async remove(id) {
    await deleteReportQuery(id);
  },

  async listAvailableSlots(userId) {
    const rows = await queryAvailablePlanningSlots(userId);
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      date: row.slot_date,
      startTime: row.start_time,
      endTime: row.end_time,
      location: row.location,
      leaderId: row.leader?.id ?? row.prayer_leader_id ?? "",
      leaderName: row.leader ? getFullName(row.leader) : "Non assigné",
    }));
  },

  async listComments(reportId) {
    const rows = await queryReportComments(reportId);
    return rows.map(ReportMapper.toComment);
  },

  async addComment(reportId, author, message) {
    const row = await createReportCommentQuery(reportId, author.id, message);
    return ReportMapper.toComment(row);
  },
};
