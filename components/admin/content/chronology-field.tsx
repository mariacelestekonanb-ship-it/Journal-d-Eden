"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EvenementChronologie } from "@/types";

export interface ChronologyFieldProps {
  values: EvenementChronologie[];
  onChange: (values: EvenementChronologie[]) => void;
}

function evenementVide(): EvenementChronologie {
  return { date: "", titre: "", description: "" };
}

/** Édition de la chronologie d'une analyse — section « Les faits » (voir `EvenementChronologie` dans `types/index.ts`). */
export function ChronologyField({ values, onChange }: ChronologyFieldProps) {
  function update(index: number, patch: Partial<EvenementChronologie>) {
    onChange(
      values.map((event, i) => (i === index ? { ...event, ...patch } : event)),
    );
  }
  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...values, evenementVide()]);
  }

  return (
    <div className="space-y-3">
      {values.map((event, index) => (
        <div
          key={index}
          className="border-border space-y-2 rounded-xl border p-4"
        >
          <div className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-[10rem_1fr]">
              <Input
                type="date"
                value={event.date}
                onChange={(e) => update(index, { date: e.target.value })}
                aria-label="Date de l'événement"
              />
              <Input
                value={event.titre}
                onChange={(e) => update(index, { titre: e.target.value })}
                placeholder="Titre de l'événement"
                aria-label="Titre de l'événement"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive size-9 shrink-0"
              onClick={() => remove(index)}
              aria-label="Supprimer cet événement"
            >
              <X className="size-4" />
            </Button>
          </div>
          <Input
            value={event.description ?? ""}
            onChange={(e) => update(index, { description: e.target.value })}
            placeholder="Description (optionnel)"
            aria-label="Description de l'événement"
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>
        <Plus aria-hidden />
        Ajouter un événement
      </Button>
    </div>
  );
}
