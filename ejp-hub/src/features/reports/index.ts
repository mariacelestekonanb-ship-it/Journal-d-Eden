/**
 * Point d'entrée public du module Comptes rendus. Les autres modules (et
 * les routes de `src/app/`) ne doivent importer que depuis ce fichier —
 * jamais un chemin profond vers `services/`, `repositories/`, `queries/`,
 * `data/`, etc.
 */
export { ReportsView } from "./pages/reports-view";
export { ReportCreateView } from "./pages/report-create-view";
export { ReportDetailView } from "./pages/report-detail-view";
export { ReportEditView } from "./pages/report-edit-view";
export type { Report, ReportComment, ReportFilters, ReportStatus } from "./types/report.types";
export { ReportService } from "./services/report.service";
export { getReportPermissions, type ReportPermissions } from "./utils/report-permissions";
