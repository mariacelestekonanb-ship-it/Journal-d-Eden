import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MockReportRepository } from "../repositories/mock-report-repository";
import type { ReportListContext, ReportRepository } from "../repositories/report-repository";
import { SupabaseReportRepository } from "../repositories/supabase-report-repository";
import type { Report, ReportComment, ReportParticipant, ReportSlotOption } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";

/**
 * Point d'entrée unique pour toute donnée des Comptes rendus. Les
 * composants et hooks ne connaissent que cette interface — jamais
 * `ReportRepository`, `report.queries.ts` ni le client Supabase
 * directement.
 *
 * La bascule mock/réel est entièrement transparente : une fois Supabase
 * configuré, `getRepository()` retourne `SupabaseReportRepository` sans
 * qu'aucun appelant n'ait à changer.
 */
function getRepository(): ReportRepository {
  return isSupabaseConfigured() ? SupabaseReportRepository : MockReportRepository;
}

export const ReportService = {
  async list(context: ReportListContext): Promise<Report[]> {
    return getRepository().list(context);
  },

  async getById(id: string, context: ReportListContext): Promise<Report | null> {
    return getRepository().getById(id, context);
  },

  async create(
    values: ReportFormValues,
    slotId: string,
    leader: ReportParticipant,
    author: ReportParticipant,
  ): Promise<Report> {
    return getRepository().create(values, slotId, leader, author);
  },

  async update(id: string, values: ReportFormValues): Promise<Report> {
    return getRepository().update(id, values);
  },

  async submit(id: string): Promise<Report> {
    return getRepository().submit(id);
  },

  async validate(id: string): Promise<Report> {
    return getRepository().validate(id);
  },

  async reject(id: string): Promise<Report> {
    return getRepository().reject(id);
  },

  async remove(id: string): Promise<void> {
    return getRepository().remove(id);
  },

  async listAvailableSlots(userId: string): Promise<ReportSlotOption[]> {
    return getRepository().listAvailableSlots(userId);
  },

  async listPendingReportSlots(): Promise<ReportSlotOption[]> {
    return getRepository().listPendingReportSlots();
  },

  async listComments(reportId: string): Promise<ReportComment[]> {
    return getRepository().listComments(reportId);
  },

  async addComment(reportId: string, author: ReportParticipant, message: string): Promise<ReportComment> {
    return getRepository().addComment(reportId, author, message);
  },
};
