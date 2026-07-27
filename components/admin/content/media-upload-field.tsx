"use client";

import * as React from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface MediaUploadValue {
  url: string;
  type: "image" | "video";
}

export interface MediaUploadFieldProps {
  value?: MediaUploadValue;
  onChange: (value: MediaUploadValue | undefined) => void;
  /** `image/*` seul si la vidéo n'a pas de sens pour ce champ (ex. logo). */
  accept?: string;
  placeholder?: string;
  helperText?: string;
}

/**
 * Champ d'upload réel (voir `app/api/upload/route.ts`) — distinct de
 * `CoverImageField`, qui pointe vers la médiathèque factice de démonstration.
 * Ici, le fichier déposé par la rédactrice est réellement envoyé au
 * serveur et écrit sur disque, pas seulement référencé.
 */
export function MediaUploadField({
  value,
  onChange,
  accept = "image/*,video/*",
  placeholder = "Déposer une image ou une vidéo",
  helperText,
}: MediaUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Échec de l'envoi du fichier.");
      }
      onChange({ url: data.url, type: data.type });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Échec de l'envoi du fichier.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="border-border flex items-start gap-3 rounded-xl border p-3">
          <div className="bg-muted/50 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            {value.type === "video" ? (
              <video src={value.url} className="size-full object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- fichier réellement uploadé sur disque local (voir app/api/upload/route.ts), pas une image distante à optimiser.
              <img src={value.url} alt="" className="size-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-muted-foreground truncate text-xs">
              {value.url}
            </p>
            <p className="text-muted-foreground text-xs">
              {value.type === "video" ? "Vidéo" : "Image"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive size-9 shrink-0"
            onClick={() => onChange(undefined)}
            aria-label="Retirer le fichier"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="border-border text-muted-foreground hover:border-ring hover:text-foreground focus-visible:ring-ring flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
        >
          {isUploading ? (
            <Loader2 className="size-6 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="size-6" aria-hidden />
          )}
          {isUploading ? "Envoi en cours…" : placeholder}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        aria-label={placeholder}
      />

      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      {helperText && !error ? (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      ) : null}
    </div>
  );
}
