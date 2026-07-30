import { format, isValid, parse as parseDate } from "date-fns";

import { downloadCsv, parseCsv } from "@/shared/utils/csv";

import type { PlanningLeaderOption } from "../types/planning.types";
import { PLANNING_STATUS_LABELS } from "../utils/planning-status";
import { planningSlotSchema, type PlanningSlotFormValues } from "../validation/planning-slot.schema";

const TEMPLATE_HEADER = [
  "Titre",
  "Date (JJ/MM/AAAA)",
  "Heure de début (HH:mm)",
  "Heure de fin (HH:mm)",
  "Lieu",
  "Conducteur principal",
  "Conducteur secondaire",
  "Thème",
  "Statut",
];

const STATUS_LABEL_TO_VALUE: Record<string, PlanningSlotFormValues["status"]> = Object.fromEntries(
  Object.entries(PLANNING_STATUS_LABELS).map(([value, label]) => [label.toLowerCase(), value as PlanningSlotFormValues["status"]]),
);

export interface PlanningImportRowError {
  row: number;
  message: string;
}

export interface PlanningImportResult {
  valid: PlanningSlotFormValues[];
  errors: PlanningImportRowError[];
}

function findLeaderId(name: string, leaders: PlanningLeaderOption[]): string | null {
  const trimmed = name.trim().toLowerCase();
  return leaders.find((leader) => leader.fullName.trim().toLowerCase() === trimmed)?.id ?? null;
}

function parseFrenchDate(value: string): string | null {
  const parsed = parseDate(value.trim(), "dd/MM/yyyy", new Date());
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : null;
}

/**
 * Import CSV du Planning : chaque ligne devient un créneau, créé avec les
 * mêmes règles que le formulaire (`planningSlotSchema`) — aucune double
 * réservation ni conflit horaire n'est vérifié ici, `useCreateSlot` fait
 * exactement le même travail que la création manuelle, ligne par ligne.
 * Les conducteurs sont reconnus par leur nom complet exact (tel qu'affiché
 * dans l'application) — pas d'identifiant technique à manipuler.
 */
export const PlanningImportService = {
  downloadTemplate(): void {
    downloadCsv(
      TEMPLATE_HEADER,
      [["Prière du mercredi", "05/03/2026", "18:00", "19:00", "Salle principale", "Jean Dupont", "", "Paix", "Confirmé"]],
      "modele-import-planning",
    );
  },

  parse(text: string, leaders: PlanningLeaderOption[]): PlanningImportResult {
    const rows = parseCsv(text);
    const dataRows = rows[0]?.[0]?.trim().toLowerCase() === "titre" ? rows.slice(1) : rows;

    const valid: PlanningSlotFormValues[] = [];
    const errors: PlanningImportRowError[] = [];

    dataRows.forEach((cells, index) => {
      const rowNumber = index + 2;
      const [title, dateRaw, startTime, endTime, location, leaderName, secondaryLeaderName, theme, statusRaw] = cells;

      if (!title?.trim()) {
        errors.push({ row: rowNumber, message: "Titre manquant." });
        return;
      }

      const date = dateRaw ? parseFrenchDate(dateRaw) : null;
      if (!date) {
        errors.push({ row: rowNumber, message: `Date invalide : « ${dateRaw ?? ""} » (format attendu JJ/MM/AAAA).` });
        return;
      }

      const leaderId = leaderName ? findLeaderId(leaderName, leaders) : null;
      if (!leaderId) {
        errors.push({ row: rowNumber, message: `Conducteur principal introuvable : « ${leaderName ?? ""} ».` });
        return;
      }

      let secondaryLeaderId = "";
      if (secondaryLeaderName?.trim()) {
        const found = findLeaderId(secondaryLeaderName, leaders);
        if (!found) {
          errors.push({ row: rowNumber, message: `Conducteur secondaire introuvable : « ${secondaryLeaderName} ».` });
          return;
        }
        secondaryLeaderId = found;
      }

      const status = statusRaw?.trim() ? STATUS_LABEL_TO_VALUE[statusRaw.trim().toLowerCase()] : "DRAFT";
      if (!status) {
        errors.push({
          row: rowNumber,
          message: `Statut inconnu : « ${statusRaw} » (attendu : ${Object.values(PLANNING_STATUS_LABELS).join(", ")}).`,
        });
        return;
      }

      const candidate: PlanningSlotFormValues = {
        title: title.trim(),
        description: "",
        date,
        startTime: startTime?.trim() ?? "",
        endTime: endTime?.trim() ?? "",
        location: location?.trim() ?? "",
        primaryLeaderId: leaderId,
        secondaryLeaderId,
        theme: theme?.trim() ?? "",
        prayerTopicId: "",
        status,
        notes: "",
      };

      const result = planningSlotSchema.safeParse(candidate);
      if (!result.success) {
        errors.push({ row: rowNumber, message: result.error.issues[0]?.message ?? "Ligne invalide." });
        return;
      }

      valid.push(result.data);
    });

    return { valid, errors };
  },
};
