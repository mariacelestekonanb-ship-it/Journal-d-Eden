"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ReferenceJuridique, TypeReference } from "@/types";

export interface ReferencesFieldProps {
  values: ReferenceJuridique[];
  onChange: (values: ReferenceJuridique[]) => void;
}

const TYPES_REFERENCE: TypeReference[] = [
  "Traité",
  "Loi",
  "Règlement",
  "Convention",
  "Directive",
  "Décision",
  "Jurisprudence",
  "Site officiel",
];

function referenceVide(): ReferenceJuridique {
  return { type: "Loi", titre: "", citation: "", organisme: "", url: "" };
}

/**
 * Édition d'une liste de références juridiques — utilisé pour `references`
 * (fiches) et `contexteJuridique` (analyses), toutes deux des
 * `ReferenceJuridique[]` (voir `types/index.ts`). Même forme de champs que
 * le bloc « référence juridique » de l'éditeur riche (voir
 * `components/admin/editor/block-fields.tsx`), mais répétable en liste
 * indépendante du corps de texte.
 */
export function ReferencesField({ values, onChange }: ReferencesFieldProps) {
  function update(index: number, patch: Partial<ReferenceJuridique>) {
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
                  update(index, { type: e.target.value as TypeReference })
                }
              >
                {TYPES_REFERENCE.map((type) => (
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
            placeholder="Titre du texte"
          />
          <Input
            value={reference.citation}
            onChange={(e) => update(index, { citation: e.target.value })}
            placeholder="Citation précise (article, numéro, année…)"
          />
          <Input
            value={reference.url ?? ""}
            onChange={(e) => update(index, { url: e.target.value })}
            placeholder="URL (optionnel)"
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
