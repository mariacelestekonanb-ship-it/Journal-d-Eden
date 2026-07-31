import { getFullName } from "@/shared/utils/get-full-name";

import type { RawReportComment, RawReportProfile, RawReportRow } from "../queries/report.queries";
import type { Report, ReportComment, ReportParticipant } from "../types/report.types";

function toParticipant(profile: RawReportProfile | null): ReportParticipant {
  return profile
    ? { id: profile.id, fullName: getFullName(profile), isActive: profile.is_active }
    : { id: "", fullName: "Inconnu" };
}

/**
 * Convertit les lignes brutes de `report.queries.ts` en `Report` (le modèle
 * métier utilisé par tous les composants). Isole le reste du module de la
 * forme exacte de la table — un renommage de colonne ne touche que ce
 * fichier.
 */
export const ReportMapper = {
  toReport(row: RawReportRow): Report {
    return {
      id: row.id,
      planningSlot: row.planning
        ? {
            id: row.planning.id,
            title: row.planning.title,
            date: row.planning.slot_date,
            startTime: row.planning.start_time,
            endTime: row.planning.end_time,
            location: row.planning.location,
          }
        : { id: "", title: "Créneau supprimé", date: row.created_at.slice(0, 10), startTime: "", endTime: "", location: null },
      leader: toParticipant(row.leader),
      authorId: row.author?.id ?? "",
      authorName: row.author ? getFullName(row.author) : "Auteur inconnu",
      generalInfo: {
        date: row.session_date,
        startTime: row.session_start_time,
        endTime: row.session_end_time,
        connectedCount: row.connected_count,
        hasInstrumental: row.has_instrumental,
      },
      thanksgiving: row.thanksgiving,
      holySpiritInvitation: row.holy_spirit_invitation,
      prayerPoints: row.prayer_points,
      closingThanksgiving: row.closing_thanksgiving,
      announcements: row.announcements ?? "",
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      submittedAt: row.submitted_at,
      validatedAt: row.validated_at,
    };
  },

  toComment(row: RawReportComment): ReportComment {
    return {
      id: row.id,
      reportId: row.report_id,
      authorId: row.author_id,
      authorName: row.author ? getFullName(row.author) : "Administrateur",
      message: row.message,
      createdAt: row.created_at,
    };
  },
};
