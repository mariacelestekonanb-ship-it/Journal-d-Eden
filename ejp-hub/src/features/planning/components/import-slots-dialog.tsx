"use client";

import { AlertTriangle, CheckCircle2, Loader2, Upload } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";

import { useActiveConducteurs } from "../hooks/use-planning";
import { parsePlanningExcelFile, type ParsedImportResult } from "../services/planning-import.service";
import { bulkCreateSlots } from "../services/planning.service";

interface ImportSlotsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
}

export function ImportSlotsDialog({ open, onOpenChange, onImported }: ImportSlotsDialogProps) {
  const { data: conducteurs } = useActiveConducteurs();
  const [result, setResult] = React.useState<ParsedImportResult | null>(null);
  const [isParsing, setIsParsing] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function reset() {
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const parsed = await parsePlanningExcelFile(file);
      setResult(parsed);
    } catch {
      toast.error("Impossible de lire ce fichier. Vérifiez qu'il s'agit bien d'un fichier Excel (.xlsx).");
    } finally {
      setIsParsing(false);
    }
  }

  async function handleImport() {
    if (!result || result.valid.length === 0) return;
    setIsImporting(true);
    try {
      const { inserted } = await bulkCreateSlots(result.valid, conducteurs ?? []);
      toast.success(`${inserted} créneau${inserted > 1 ? "x" : ""} importé${inserted > 1 ? "s" : ""}.`);
      onImported();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de l'import.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importer un planning depuis Excel</DialogTitle>
          <DialogDescription>
            Colonnes attendues : <strong>Date</strong>, <strong>Début</strong>, <strong>Fin</strong>,
            <strong> Conducteur</strong> (nom complet exact), <strong>Lieu</strong> (optionnel).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors hover:bg-muted/50">
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium">Cliquez pour choisir un fichier .xlsx</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          {isParsing && <p className="text-sm text-muted-foreground">Analyse du fichier…</p>}

          {result && (
            <div className="space-y-2 rounded-lg border border-border p-3 text-sm">
              <p className="flex items-center gap-2 text-success">
                <CheckCircle2 className="size-4" />
                {result.valid.length} ligne{result.valid.length > 1 ? "s" : ""} prête
                {result.valid.length > 1 ? "s" : ""} à être importée{result.valid.length > 1 ? "s" : ""}
              </p>
              {result.errors.length > 0 && (
                <div className="space-y-1 text-warning">
                  <p className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="size-4" />
                    {result.errors.length} ligne{result.errors.length > 1 ? "s" : ""} ignorée
                    {result.errors.length > 1 ? "s" : ""}
                  </p>
                  <ul className="ml-6 list-disc text-xs text-muted-foreground">
                    {result.errors.slice(0, 5).map((error) => (
                      <li key={error.row}>
                        Ligne {error.row} : {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleImport} disabled={!result || result.valid.length === 0 || isImporting}>
            {isImporting && <Loader2 className="size-4 animate-spin" />}
            Importer {result ? `(${result.valid.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
