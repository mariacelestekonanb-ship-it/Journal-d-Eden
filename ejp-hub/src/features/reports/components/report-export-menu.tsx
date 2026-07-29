"use client";

import { FileDown, Printer } from "lucide-react";
import { toast } from "sonner";

import { AppButton } from "@/shared/components/app-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { ReportExportService } from "../services/report-export.service";
import type { Report } from "../types/report.types";

export interface ReportExportMenuProps {
  report: Report;
}

/** Export d'un compte rendu — impression fonctionnelle, PDF/Word en architecture seule (voir REPORTS.md). */
export function ReportExportMenu({ report }: ReportExportMenuProps) {
  function handleExport(format: "pdf" | "word" | "print") {
    const result =
      format === "print"
        ? ReportExportService.print(report)
        : format === "pdf"
          ? ReportExportService.exportToPdf(report)
          : ReportExportService.exportToWord(report);

    if (!result.supported) toast.info(result.message);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton variant="outline">
          <FileDown className="size-4" />
          Exporter
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => handleExport("print")}>
          <Printer className="size-4" />
          Imprimer
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleExport("pdf")}>
          <FileDown className="size-4" />
          Exporter en PDF (bientôt disponible)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleExport("word")}>
          <FileDown className="size-4" />
          Exporter en Word (bientôt disponible)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
