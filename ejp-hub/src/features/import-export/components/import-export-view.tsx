"use client";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { FileDown, FileSpreadsheet, Upload } from "lucide-react";
import * as React from "react";

import { ImportSlotsDialog } from "@/features/planning/components/import-slots-dialog";
import { useSlotsInRange } from "@/features/planning/hooks/use-planning";
import { exportPlanningToExcel, exportPlanningToPdf } from "@/features/planning/services/planning-export.service";
import { usePrayerTopics } from "@/features/prayer-topics/hooks/use-prayer-topics";
import { exportPrayerTopicsToExcel } from "@/features/prayer-topics/services/prayer-topics-export.service";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function ImportExportView() {
  const [startDate, setStartDate] = React.useState(() => format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [endDate, setEndDate] = React.useState(() => format(endOfMonth(new Date()), "yyyy-MM-dd"));
  const [importOpen, setImportOpen] = React.useState(false);

  const { data: slots, refetch } = useSlotsInRange(startDate, endDate);
  const { data: topics } = usePrayerTopics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import / Export"
        description="Importez un planning depuis Excel, ou exportez vos données pour archivage et impression."
      />

      <Card>
        <CardHeader>
          <CardTitle>Planning</CardTitle>
          <CardDescription>Sélectionnez une période, puis importez ou exportez les créneaux.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Du</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Au</Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {slots?.length ?? 0} créneau{(slots?.length ?? 0) > 1 ? "x" : ""} sur cette période.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="size-4" />
              Importer depuis Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => exportPlanningToExcel(slots ?? [], `planning-${startDate}-au-${endDate}`)}
            >
              <FileSpreadsheet className="size-4" />
              Exporter en Excel
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                exportPlanningToPdf(
                  slots ?? [],
                  `planning-${startDate}-au-${endDate}`,
                  `Planning du ${startDate} au ${endDate}`,
                )
              }
            >
              <FileDown className="size-4" />
              Exporter en PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sujets de prière</CardTitle>
          <CardDescription>Exportez l&apos;ensemble des sujets de prière, actifs et archivés.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => exportPrayerTopicsToExcel(topics ?? [], "sujets-de-priere")}
          >
            <FileSpreadsheet className="size-4" />
            Exporter en Excel
          </Button>
        </CardContent>
      </Card>

      <ImportSlotsDialog open={importOpen} onOpenChange={setImportOpen} onImported={() => refetch()} />
    </div>
  );
}
