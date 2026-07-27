"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ReferenceOfficielle, TypeReferenceOfficielle } from "@/types";

export interface OfficialReferencesFieldProps {
  values: ReferenceOfficielle[];
  onChange: (values: ReferenceOfficielle[]) => void;
}

const TYPES: TypeReferenceOfficielle[] = [
  "Texte officiel",
  "Communiqué",
  "Site officiel",
  "Document PDF",
];

function referenceVide(): ReferenceOfficielle {
  return { type: "Texte officiel", titre: "", organisme: "", url: "" };
}

/** Édition des références officielles d'une analyse — section « Références officielles » (voir `ReferenceOfficielle` dans `types/index.ts`). */
export function OfficialReferencesField({
  values,
  onChange,
}: OfficialReferencesFieldProps) {
  function update(index: number, patch: Partial<ReferenceOfficielle>) {
    onChange(
      values.map((reference, i) =>
        i === index ? { ...reference, ...patch } : reference,
      ),
    );
  }
  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...values, referenceVide()]);
  }

  return (
    <div className="space-y-3">
      {values.map((reference, index) => (
        <div
          key={index}
          className="border-border space-y-2 rounded-2xl border p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <Select
                value={reference.type}
                onChange={(e) =>
                  update(index, {
                    type: e.target.value as TypeReferenceOfficielle,
                  })
                }
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              <Input
                value={reference.organisme}
                onChange={(e) => update(index, { organisme: e.target.value })}
                placeholder="Organisme"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive size-9 shrink-0"
              onClick={() => remove(index)}
              aria-label="Supprimer cette référence"
            >
              <X className="size-4" />
            </Button>
          </div>
          <Input
            value={reference.titre}
            onChange={(e) => update(index, { titre: e.target.value })}
            placeholder="Titre"
          />
          <Input
            value={reference.url}
            onChange={(e) => update(index, { url: e.target.value })}
            placeholder="URL"
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>
        <Plus aria-hidden />
        Ajouter une référence
      </Button>
    </div>
  );
}
