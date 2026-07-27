"use client";

import * as React from "react";
import { ImagePlus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";
import { MEDIA_TYPE_ICONS } from "@/lib/admin/media";
import type { Couverture } from "@/lib/admin/types";

export interface CoverImageFieldProps {
  value: Couverture | undefined;
  onChange: (value: Couverture | undefined) => void;
}

/**
 * Image de couverture d'un contenu : sélection depuis la médiathèque
 * (`MediaPickerDialog`), texte alternatif et légende. Réutilisé par les
 * quatre formulaires de contenu (fiches, analyses, glossaire, ressources) —
 * un seul champ, un seul comportement, quel que soit le type éditorial.
 */
export function CoverImageField({ value, onChange }: CoverImageFieldProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const Icon = value ? (MEDIA_TYPE_ICONS.image ?? ImagePlus) : ImagePlus;

  return (
    <div className="space-y-3">
      {value ? (
        <div className="border-border flex items-start gap-3 rounded-xl border p-3">
          <span className="bg-muted/50 text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-muted-foreground truncate text-xs">
              {value.url}
            </p>
            <Input
              value={value.alt}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              placeholder="Texte alternatif"
            />
            <Input
              value={value.legende ?? ""}
              onChange={(e) => onChange({ ...value, legende: e.target.value })}
              placeholder="Légende (optionnel)"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive size-9 shrink-0"
            onClick={() => onChange(undefined)}
            aria-label="Retirer l'image de couverture"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="border-border text-muted-foreground hover:border-ring hover:text-foreground focus-visible:ring-ring flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ImagePlus className="size-6" aria-hidden />
          Choisir une image de couverture
        </button>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        allowedTypes={["image", "illustration"]}
        onSelect={(asset) =>
          onChange({ url: asset.url, alt: asset.alt ?? asset.nom })
        }
      />
    </div>
  );
}
