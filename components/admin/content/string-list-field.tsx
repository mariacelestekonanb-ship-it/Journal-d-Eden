"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface StringListFieldProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  /** `true` pour des paragraphes (contexte), `false` pour des puces courtes (points clés). */
  multiline?: boolean;
}

/**
 * Édition d'une liste de chaînes simples — utilisé pour `contexte` et
 * `pointsCles` des fiches et analyses (voir `types/index.ts`), qui sont
 * toutes deux de simples `string[]` sans structure supplémentaire.
 */
export function StringListField({
  values,
  onChange,
  placeholder,
  addLabel = "Ajouter",
  multiline = false,
}: StringListFieldProps) {
  const Field = multiline ? Textarea : Input;

  function update(index: number, value: string) {
    onChange(values.map((v, i) => (i === index ? value : v)));
  }
  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...values, ""]);
  }

  return (
    <div className="space-y-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-start gap-2">
          <Field
            value={value}
            onChange={(e) => update(index, e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder ?? `Entrée ${index + 1}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive size-9 shrink-0"
            onClick={() => remove(index)}
            aria-label="Supprimer cette entrée"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>
        <Plus aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}
