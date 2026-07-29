import { getFullName } from "@/shared/utils/get-full-name";

import type {
  RawMemberAssignmentRow,
  RawMemberReportRow,
  RawMemberRow,
} from "../queries/member.queries";
import type { Member, MemberAssignmentSummary, MemberReportSummary } from "../types/member.types";

/**
 * Convertit les lignes brutes de `member.queries.ts` en `Member` (le modèle
 * métier utilisé par tous les composants). Isole le reste du module de la
 * forme exacte de `profiles` — un renommage de colonne ne touche que ce
 * fichier.
 */
export const MemberMapper = {
  toMember(row: RawMemberRow): Member {
    return {
      id: row.id,
      firstName: row.firstname,
      lastName: row.lastname,
      fullName: getFullName({ firstname: row.firstname, lastname: row.lastname }),
      email: row.email,
      phone: row.phone,
      photoUrl: row.avatar_url,
      role: row.role,
      status: row.status,
      registeredAt: row.created_at,
      validatedAt: row.validated_at,
      validatedBy: row.validator ? { id: row.validator.id, fullName: getFullName(row.validator) } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  toAssignmentSummary(row: RawMemberAssignmentRow): MemberAssignmentSummary {
    return {
      id: row.id,
      title: row.title,
      date: row.slot_date,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
    };
  },

  toReportSummary(row: RawMemberReportRow): MemberReportSummary {
    return {
      id: row.id,
      planningSlotTitle: row.planning?.title ?? "Créneau supprimé",
      date: row.planning?.slot_date ?? row.created_at.slice(0, 10),
      status: row.status,
    };
  },
};
