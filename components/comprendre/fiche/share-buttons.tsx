"use client";

import * as React from "react";
import { Share2, Link2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface ShareButtonsProps {
  url: string;
  title: string;
}

/**
 * « Partager » utilise l'API Web Share si le navigateur la supporte, avec
 * repli silencieux sur la copie du lien sinon. « Copier le lien » copie
 * toujours l'URL, avec une confirmation annoncée aux lecteurs d'écran.
 */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission refusée) : on ignore silencieusement.
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Partage annulé ou indisponible : on retombe sur la copie du lien.
      }
    }
    await handleCopy();
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="size-4" aria-hidden />
        Partager
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Link2 className="size-4" aria-hidden />
        )}
        Copier le lien
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Lien copié" : ""}
      </span>
    </div>
  );
}
