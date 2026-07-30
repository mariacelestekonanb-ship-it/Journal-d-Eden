"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Download, Upload } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { AppButton } from "@/shared/components/app-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

import { createSlotAction } from "../actions/create-slot.action";
import { usePlanningLeaderOptions } from "../hooks/use-planning-slots";
import { PLANNING_SLOTS_KEY } from "../hooks/use-planning-slots";
import { PlanningImportService, type PlanningImportRowError } from "../services/planning-import.service";

export interface PlanningImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ImportState =
  | { step: "pick" }
  | { step: "importing"; total: number; done: number }
  | { step: "done"; createdCount: number; errors: PlanningImportRowError[] };

/**
 * Import CSV du Planning : chaque ligne valide est créée exactement comme
 * une création manuelle (`createSlotAction`, une par une), les lignes
 * invalides sont écartées et listées à la fin — jamais d'échec total pour
 * une seule ligne en erreur (voir `PlanningImportService`).
 */
export function PlanningImportDialog({ open, onOpenChange }: PlanningImportDialogProps) {
  const { data: leaders } = usePlanningLeaderOptions();
  const queryClient = useQueryClient();
  const [state, setState] = React.useState<ImportState>({ step: "pick" });
  const [parseErrors, setParseErrors] = React.useState<PlanningImportRowError[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function reset() {
    setState({ step: "pick" });
    setParseErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const { valid, errors } = PlanningImportService.parse(text, leaders ?? []);
    setParseErrors(errors);

    if (valid.length === 0) {
      toast.error("Aucune ligne valide dans ce fichier.");
      return;
    }

    setState({ step: "importing", total: valid.length, done: 0 });

    let createdCount = 0;
    const creationErrors: PlanningImportRowError[] = [...errors];

    for (const [index, values] of valid.entries()) {
      try {
        await createSlotAction(values);
        createdCount += 1;
      } catch (error) {
        creationErrors.push({
          row: index,
          message: `« ${values.title} » : ${error instanceof Error ? error.message : "échec de la création."}`,
        });
      }
      setState({ step: "importing", total: valid.length, done: index + 1 });
    }

    queryClient.invalidateQueries({ queryKey: PLANNING_SLOTS_KEY });
    setState({ step: "done", createdCount, errors: creationErrors });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importer des créneaux</DialogTitle>
          <DialogDescription>
            Un fichier CSV, une ligne par créneau. Téléchargez le modèle pour respecter le format attendu.
          </DialogDescription>
        </DialogHeader>

        {state.step === "pick" && (
          <div className="space-y-4">
            <AppButton variant="outline" className="w-full" onClick={() => PlanningImportService.downloadTemplate()}>
              <Download className="size-4" />
              Télécharger le modèle CSV
            </AppButton>

            <div className="space-y-2">
              <label htmlFor="planning-import-file" className="text-sm font-medium text-foreground">
                Fichier CSV à importer
              </label>
              <Input
                id="planning-import-file"
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileSelected}
              />
            </div>

            {parseErrors.length > 0 && (
              <ImportErrorsList title="Lignes ignorées lors de la dernière lecture" errors={parseErrors} />
            )}
          </div>
        )}

        {state.step === "importing" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Upload className="size-8 animate-pulse text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Import en cours… {state.done} / {state.total}
            </p>
          </div>
        )}

        {state.step === "done" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-3">
              <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
              <p className="text-sm text-foreground">
                {state.createdCount} créneau{state.createdCount > 1 ? "x" : ""} créé{state.createdCount > 1 ? "s" : ""} avec
                succès.
              </p>
            </div>
            {state.errors.length > 0 && (
              <ImportErrorsList title={`${state.errors.length} ligne(s) non importée(s)`} errors={state.errors} />
            )}
          </div>
        )}

        <DialogFooter>
          {state.step === "done" ? (
            <AppButton onClick={() => onOpenChange(false)}>Fermer</AppButton>
          ) : (
            <AppButton variant="outline" onClick={() => onOpenChange(false)} disabled={state.step === "importing"}>
              Annuler
            </AppButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportErrorsList({ title, errors }: { title: string; errors: PlanningImportRowError[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-destructive">
        <AlertTriangle className="size-4" aria-hidden="true" />
        {title}
      </div>
      <ul className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-muted-foreground">
        {errors.map((error, index) => (
          <li key={index}>
            Ligne {error.row} — {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
