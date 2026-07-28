import { formatDate, formatTime } from "@/shared/utils/format";

import type { PrayerSlot } from "../types/planning.types";
import { PLANNING_STATUS_LABELS } from "../utils/planning-status";

function toCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(value) ? `"${escaped}"` : escaped;
}

function slotToCsvRow(slot: PrayerSlot): string[] {
  return [
    formatDate(slot.date, "dd/MM/yyyy"),
    `${formatTime(slot.startTime)}–${formatTime(slot.endTime)}`,
    slot.title,
    slot.location ?? "",
    slot.primaryLeader?.fullName ?? "",
    slot.secondaryLeader?.fullName ?? "",
    PLANNING_STATUS_LABELS[slot.status],
  ];
}

/**
 * Export des créneaux affichés (respecte les filtres actifs). CSV pour
 * l'instant — un export Excel/PDF plus riche est prévu pour un sprint
 * futur (voir PLANNING.md), une fois le module connecté à Supabase.
 */
export const PlanningExportService = {
  toCsv(slots: PrayerSlot[]): string {
    const header = ["Date", "Horaire", "Titre", "Lieu", "Conducteur principal", "Conducteur secondaire", "Statut"];
    const rows = slots.map(slotToCsvRow);
    return [header, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
  },

  downloadCsv(slots: PrayerSlot[], fileName = "planning"): void {
    const csv = this.toCsv(slots);
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
