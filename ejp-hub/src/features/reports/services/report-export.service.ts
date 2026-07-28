import { formatDate, formatTime } from "@/lib/format";

import type { ReportWithSlot } from "../types/report.types";

function reportFileName(report: ReportWithSlot): string {
  return `compte-rendu-${report.slot.slot_date}`;
}

export async function exportReportToPdf(report: ReportWithSlot): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Compte rendu de prière", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("EJP Hub", 14, 24);

  doc.setTextColor(0);
  doc.setFontSize(11);
  let y = 36;
  const line = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label} :`, 14, y);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(value, 130);
    doc.text(wrapped, 55, y);
    y += 6 * Math.max(wrapped.length, 1) + 2;
  };

  line("Date", formatDate(report.slot.slot_date, "dd/MM/yyyy"));
  line("Horaire", `${formatTime(report.slot.start_time)} – ${formatTime(report.slot.end_time)}`);
  line("Conducteur", report.conducteur.full_name);
  line("Sujet de prière", report.slot.topic?.title ?? "—");
  line("Lieu", report.slot.location ?? "—");
  line("Nombre de présents", report.attendees_count?.toString() ?? "—");
  y += 2;
  line("Sujets abordés", report.topics_covered || "—");
  y += 2;
  line("Compte rendu", report.content);
  y += 2;
  line("Suivi à prévoir", report.follow_up || "—");

  doc.save(`${reportFileName(report)}.pdf`);
}

export async function exportReportToWord(report: ReportWithSlot): Promise<void> {
  const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import("docx");

  const section = (label: string, value: string) => [
    new Paragraph({ text: label, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 80 } }),
    new Paragraph({ children: [new TextRun(value || "—")] }),
  ];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "Compte rendu de prière", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [new TextRun({ text: "EJP Hub", color: "888888" })],
            spacing: { after: 200 },
          }),
          ...section("Date", formatDate(report.slot.slot_date, "dd/MM/yyyy")),
          ...section("Horaire", `${formatTime(report.slot.start_time)} – ${formatTime(report.slot.end_time)}`),
          ...section("Conducteur", report.conducteur.full_name),
          ...section("Sujet de prière", report.slot.topic?.title ?? "—"),
          ...section("Lieu", report.slot.location ?? "—"),
          ...section("Nombre de présents", report.attendees_count?.toString() ?? "—"),
          ...section("Sujets abordés", report.topics_covered ?? ""),
          ...section("Compte rendu", report.content),
          ...section("Suivi à prévoir", report.follow_up ?? ""),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${reportFileName(report)}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}
