"use client";

import { Heading } from "@/components/ui/heading";
import { StringListField } from "@/components/admin/content/string-list-field";
import type { ImpactAnalyse } from "@/types";

export interface ImpactFieldProps {
  value: ImpactAnalyse;
  onChange: (value: ImpactAnalyse) => void;
}

const GROUPES: Array<{ key: keyof ImpactAnalyse; label: string }> = [
  { key: "juridique", label: "Juridique" },
  { key: "pratique", label: "Pratique" },
  { key: "institutionnel", label: "Institutionnel" },
  { key: "economique", label: "Économique" },
];

/**
 * Édition des conséquences d'une analyse par catégorie — section « Pourquoi
 * cette décision est importante » (voir `ImpactAnalyse` dans
 * `types/index.ts`). Chaque catégorie reste optionnelle : une liste vide
 * équivaut à une catégorie non renseignée.
 */
export function ImpactField({ value, onChange }: ImpactFieldProps) {
  return (
    <div className="space-y-5">
      {GROUPES.map((groupe) => (
        <div key={groupe.key} className="space-y-2">
          <Heading as="h3" size="xs">
            {groupe.label}
          </Heading>
          <StringListField
            values={value[groupe.key] ?? []}
            onChange={(values) =>
              onChange({
                ...value,
                [groupe.key]: values.length > 0 ? values : undefined,
              })
            }
            placeholder="Une conséquence"
            addLabel="Ajouter"
          />
        </div>
      ))}
    </div>
  );
}
