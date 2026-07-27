import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Paragraph } from "@/components/ui/paragraph";

export interface ValidationCheck {
  label: string;
  valid: boolean;
}

export interface ValidationSummaryProps {
  checks: ValidationCheck[];
}

/**
 * Résumé de validation avant publication : liste les champs obligatoires
 * encore manquants, ou confirme que tout est en ordre. Un seul composant
 * générique — chaque formulaire lui fournit sa propre liste de conditions
 * (voir `checks`), sans logique de validation dupliquée d'un formulaire à
 * l'autre.
 */
export function ValidationSummary({ checks }: ValidationSummaryProps) {
  const missing = checks.filter((check) => !check.valid);

  if (missing.length === 0) {
    return (
      <div className="border-success/30 bg-success/10 flex items-center gap-3 rounded-xl border p-4">
        <CheckCircle2 aria-hidden className="text-success size-4.5 shrink-0" />
        <Paragraph size="sm" className="text-foreground">
          Tous les champs obligatoires sont renseignés.
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="border-gold-300/60 bg-gold-100/60 flex gap-3 rounded-xl border p-4">
      <AlertTriangle
        aria-hidden
        className="text-gold-600 mt-0.5 size-4.5 shrink-0"
      />
      <div>
        <Paragraph size="sm" className="text-foreground font-medium">
          À compléter avant publication :
        </Paragraph>
        <ul className="mt-1.5 space-y-1">
          {missing.map((check) => (
            <li
              key={check.label}
              className="text-foreground pl-3 text-sm before:float-left before:-ml-3 before:content-['—_']"
            >
              {check.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
