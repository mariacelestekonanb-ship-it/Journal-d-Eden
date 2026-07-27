import { siteConfig } from "@/lib/site-config";

export interface GooglePreviewProps {
  title: string;
  description: string;
  path: string;
}

/**
 * Reproduction sommaire d'un résultat Google — pas une simulation fidèle
 * pixel pour pixel, juste de quoi juger d'un coup d'œil si le titre et la
 * description tiennent dans l'espace habituel avant de publier.
 */
export function GooglePreview({
  title,
  description,
  path,
}: GooglePreviewProps) {
  const url = `${siteConfig.url}${path}`;

  return (
    <div className="border-border bg-card rounded-xl border p-4 font-sans">
      <p className="text-muted-foreground truncate text-sm">{url}</p>
      <p className="mt-1 truncate text-xl text-[#1a0dab] dark:text-[#8ab4f8]">
        {title || "Titre de la page"}
      </p>
      <p className="text-foreground/80 mt-1 line-clamp-2 text-sm">
        {description || "La méta-description apparaîtra ici."}
      </p>
    </div>
  );
}
