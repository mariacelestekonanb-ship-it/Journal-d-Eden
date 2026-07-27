"use client";

import * as React from "react";
import { ImagePlus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { GooglePreview } from "@/components/admin/content/google-preview";
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";
import { MEDIA_TYPE_ICONS } from "@/lib/admin/media";
import { siteConfig } from "@/lib/site-config";
import type { SeoMeta } from "@/lib/admin/types";

export interface SeoPanelProps {
  value: SeoMeta;
  onChange: (value: SeoMeta) => void;
  /** Titre calculé par défaut (celui que `buildMetadata` utiliserait sans surcharge) — affiché en aperçu tant que `value.title` est vide. */
  fallbackTitle: string;
  fallbackDescription: string;
  /** Chemin public du contenu (ex. `/comprendre/mon-slug`), utilisé pour le canonical et l'aperçu Google. */
  path: string;
}

/**
 * Panneau SEO de l'éditeur : titre, méta-description, canonical et image
 * Open Graph — chacun en simple surcharge optionnelle de ce que
 * `buildMetadata` calculerait par défaut à partir du contenu (voir
 * `lib/metadata.ts`). L'URL n'est pas éditable ici : elle découle du slug,
 * déjà généré dans l'onglet Contenu.
 */
export function SeoPanel({
  value,
  onChange,
  fallbackTitle,
  fallbackDescription,
  path,
}: SeoPanelProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const canonical = value.canonical || `${siteConfig.url}${path}`;

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <Heading as="h2" size="sm">
          Référencement
        </Heading>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="seo-title">
            Title
          </label>
          <Input
            id="seo-title"
            value={value.title ?? ""}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder={fallbackTitle}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="seo-description">
            Meta Description
          </label>
          <Textarea
            id="seo-description"
            value={value.description ?? ""}
            onChange={(e) =>
              onChange({ ...value, description: e.target.value })
            }
            placeholder={fallbackDescription}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="seo-canonical">
              Canonical
            </label>
            <Input
              id="seo-canonical"
              value={value.canonical ?? ""}
              onChange={(e) =>
                onChange({ ...value, canonical: e.target.value })
              }
              placeholder={canonical}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input value={`${siteConfig.url}${path}`} disabled />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image Open Graph</label>
          {value.ogImageUrl ? (
            <div className="border-border flex items-center gap-3 rounded-xl border p-3">
              <span className="bg-muted/50 text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-lg">
                <MEDIA_TYPE_ICONS.image className="size-5" aria-hidden />
              </span>
              <p className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
                {value.ogImageUrl}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive size-9 shrink-0"
                onClick={() => onChange({ ...value, ogImageUrl: undefined })}
                aria-label="Retirer l'image Open Graph"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              <ImagePlus aria-hidden />
              Choisir une image
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Aperçu Google
        </p>
        <GooglePreview
          title={value.title || fallbackTitle}
          description={value.description || fallbackDescription}
          path={path}
        />
      </section>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        allowedTypes={["image", "illustration"]}
        onSelect={(asset) => onChange({ ...value, ogImageUrl: asset.url })}
      />
    </div>
  );
}
