import { formatDate, formatTime } from "@/lib/format";

import type { PlanningSlotWithRelations } from "../types/planning.types";

function toRows(slots: PlanningSlotWithRelations[]) {
  return slots.map((slot) => ({
    Date: formatDate(slot.slot_date, "dd/MM/yyyy"),
    Début: formatTime(slot.start_time),
    Fin: formatTime(slot.end_time),
    Conducteur: slot.conducteur?.full_name ?? "Non assigné",
    "Sujet de prière": slot.topic?.title ?? "—",
    Lieu: slot.location ?? "—",
  }));
}

export async function exportPlanningToExcel(slots: PlanningSlotWithRelations[], fileName: string): Promise<void> {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(toRows(slots));
  worksheet["!cols"] = [{ wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 24 }, { wch: 28 }, { wch: 20 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planning");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export async function exportPlanningToPdf(
  slots: PlanningSlotWithRelations[],
  fileName: string,
  title: string,
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("EJP Hub — Planning des temps de prière", 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [["Date", "Début", "Fin", "Conducteur", "Sujet de prière", "Lieu"]],
    body: toRows(slots).map((row) => Object.values(row)),
    headStyles: { fillColor: [64, 55, 168] },
    styles: { fontSize: 9 },
  });

  doc.save(`${fileName}.pdf`);
}
