import {
  INITIAL_MOCK_COMMENTS,
  INITIAL_MOCK_REPORTS,
  MOCK_SLOT_OPTIONS,
} from "../data/report.mocks";
import type { Report, ReportComment, ReportParticipant } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";
import type { ReportListContext, ReportRepository } from "./report-repository";

/**
 * Implémentation en mémoire de `ReportRepository`, utilisée tant que
 * Supabase n'est pas configuré. L'état est mutable au niveau du module pour
 * que les actions (créer, modifier, soumettre, valider, rejeter, commenter…)
 * restent réellement interactives en mode démo — pas de simples données
 * figées.
 */
let reports: Report[] = INITIAL_MOCK_REPORTS.map((report) => ({ ...report }));
let comments: ReportComment[] = INITIAL_MOCK_COMMENTS.map((comment) => ({ ...comment }));

function requireReport(id: string): Report {
  const found = reports.find((report) => report.id === id);
  if (!found) throw new Error("Compte rendu introuvable.");
  return found;
}

/** Un conducteur ne voit jamais les CR d'un autre auteur — seul un admin voit tout. */
function isVisible(report: Report, context: ReportListContext): boolean {
  return context.role === "ADMIN" || report.authorId === context.userId;
}

function buildReport(
  id: string,
  values: ReportFormValues,
  slotId: string,
  leader: ReportParticipant,
  author: ReportParticipant,
  existing?: Report,
): Report {
  const now = new Date().toISOString();
  const slotOption = MOCK_SLOT_OPTIONS.find((slot) => slot.id === slotId);

  return {
    id,
    planningSlot: existing?.planningSlot ?? {
      id: slotOption?.id ?? slotId,
      title: slotOption?.title ?? "Créneau",
      date: slotOption?.date ?? now.slice(0, 10),
      startTime: slotOption?.startTime ?? "",
      endTime: slotOption?.endTime ?? "",
      location: slotOption?.location ?? null,
    },
    leader: existing?.leader ?? leader,
    authorId: existing?.authorId ?? author.id,
    authorName: existing?.authorName ?? author.fullName,
    generalInfo: {
      date: values.generalInfo.date,
      startTime: values.generalInfo.startTime,
      endTime: values.generalInfo.endTime,
      connectedCount: Number.isFinite(values.generalInfo.connectedCount)
        ? (values.generalInfo.connectedCount as number)
        : null,
      hasInstrumental: values.generalInfo.hasInstrumental,
    },
    thanksgiving: values.thanksgiving,
    holySpiritInvitation: values.holySpiritInvitation,
    prayerPoints: values.prayerPoints,
    closingThanksgiving: values.closingThanksgiving,
    announcements: values.announcements || "",
    status: existing?.status ?? "DRAFT",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    submittedAt: existing?.submittedAt ?? null,
    validatedAt: existing?.validatedAt ?? null,
  };
}

export const MockReportRepository: ReportRepository = {
  async list(context) {
    return reports.filter((report) => isVisible(report, context)).map((report) => ({ ...report }));
  },

  async getById(id, context) {
    const found = reports.find((report) => report.id === id);
    if (!found || !isVisible(found, context)) return null;
    return { ...found };
  },

  async create(values, slotId, leader, author) {
    const created = buildReport(crypto.randomUUID(), values, slotId, leader, author);
    reports = [...reports, created];
    return created;
  },

  async update(id, values) {
    const existing = requireReport(id);
    const updated = buildReport(id, values, existing.planningSlot.id, existing.leader, { id: existing.authorId, fullName: existing.authorName }, existing);
    reports = reports.map((report) => (report.id === id ? updated : report));
    return updated;
  },

  async submit(id) {
    const existing = requireReport(id);
    const updated: Report = { ...existing, status: "SUBMITTED", submittedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    reports = reports.map((report) => (report.id === id ? updated : report));
    return updated;
  },

  async validate(id) {
    const existing = requireReport(id);
    const updated: Report = { ...existing, status: "VALIDATED", validatedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    reports = reports.map((report) => (report.id === id ? updated : report));
    return updated;
  },

  async reject(id) {
    const existing = requireReport(id);
    const updated: Report = { ...existing, status: "REJECTED", validatedAt: null, updatedAt: new Date().toISOString() };
    reports = reports.map((report) => (report.id === id ? updated : report));
    return updated;
  },

  async remove(id) {
    reports = reports.filter((report) => report.id !== id);
    comments = comments.filter((comment) => comment.reportId !== id);
  },

  // Non filtré par conducteur en mode démo (contrairement à Supabase, dont la RLS ne permet
  // de créer un CR que pour son propre créneau) : les données fictives n'assignent qu'à deux
  // créneaux le conducteur de démo, ce qui viderait systématiquement la liste pour rien.
  async listAvailableSlots() {
    const takenSlotIds = new Set(reports.map((report) => report.planningSlot.id));
    return MOCK_SLOT_OPTIONS.filter((slot) => !takenSlotIds.has(slot.id)).map((slot) => ({ ...slot }));
  },

  async listPendingReportSlots() {
    const takenSlotIds = new Set(reports.map((report) => report.planningSlot.id));
    const today = new Date().toISOString().slice(0, 10);
    return MOCK_SLOT_OPTIONS.filter((slot) => !takenSlotIds.has(slot.id) && slot.date <= today).map((slot) => ({
      ...slot,
    }));
  },

  async listComments(reportId) {
    return comments.filter((comment) => comment.reportId === reportId).map((comment) => ({ ...comment }));
  },

  async addComment(reportId, author, message) {
    const created: ReportComment = {
      id: crypto.randomUUID(),
      reportId,
      authorId: author.id,
      authorName: author.fullName,
      message,
      createdAt: new Date().toISOString(),
    };
    comments = [...comments, created];
    return created;
  },
};
