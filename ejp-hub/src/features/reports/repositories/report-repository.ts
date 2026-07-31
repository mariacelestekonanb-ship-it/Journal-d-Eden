import type { Role } from "@/shared/constants/roles";

import type { Report, ReportComment, ReportParticipant, ReportSlotOption } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";

/** Contexte du visiteur courant — nécessaire pour appliquer l'isolation stricte (un conducteur ne voit que ses propres CR). */
export interface ReportListContext {
  userId: string;
  role: Role;
}

/**
 * Contrat d'accès aux données des Comptes rendus, indépendant de la source
 * réelle. `ReportService` ne dépend que de cette interface — jamais d'une
 * implémentation concrète — pour que brancher Supabase se limite à changer
 * `getRepository()` (voir plus bas), sans toucher au reste du module.
 */
export interface ReportRepository {
  list(context: ReportListContext): Promise<Report[]>;
  getById(id: string, context: ReportListContext): Promise<Report | null>;
  create(
    values: ReportFormValues,
    slotId: string,
    leader: ReportParticipant,
    author: ReportParticipant,
  ): Promise<Report>;
  update(id: string, values: ReportFormValues): Promise<Report>;
  submit(id: string): Promise<Report>;
  validate(id: string): Promise<Report>;
  reject(id: string): Promise<Report>;
  remove(id: string): Promise<void>;
  listAvailableSlots(userId: string): Promise<ReportSlotOption[]>;
  /** Créneaux passés sans compte rendu, tous conducteurs confondus — réservé à l'admin (relance manuelle). */
  listPendingReportSlots(): Promise<ReportSlotOption[]>;
  listComments(reportId: string): Promise<ReportComment[]>;
  addComment(reportId: string, author: ReportParticipant, message: string): Promise<ReportComment>;
}
