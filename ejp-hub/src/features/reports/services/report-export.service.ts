import type { Report } from "../types/report.types";

export interface ReportExportResult {
  supported: boolean;
  message: string;
}

/**
 * Export d'un compte rendu — architecture prête pour PDF et Word, seule
 * l'impression est câblée immédiatement (ne nécessite aucune dépendance
 * supplémentaire). Voir REPORTS.md pour le plan d'implémentation complet
 * (bibliothèque de génération PDF/DOCX à introduire, gabarit imprimable).
 */
export const ReportExportService = {
  print(report: Report): ReportExportResult {
    if (typeof window === "undefined") {
      return { supported: false, message: "Impression indisponible dans ce contexte." };
    }
    const previousTitle = document.title;
    document.title = `Chaîne de prière — ${report.planningSlot.title}`;
    window.print();
    document.title = previousTitle;
    return { supported: true, message: "Impression lancée." };
  },

  exportToPdf(report: Report): ReportExportResult {
    return {
      supported: false,
      message: `Export PDF de « ${report.planningSlot.title} » à venir — architecture prête, voir REPORTS.md.`,
    };
  },

  exportToWord(report: Report): ReportExportResult {
    return {
      supported: false,
      message: `Export Word de « ${report.planningSlot.title} » à venir — architecture prête, voir REPORTS.md.`,
    };
  },
};
