export interface HeroBackdropProps {
  /** Image de fond déposée depuis /admin/reglages — absente, le fond bleu nuit uni (avec la grille décorative) reste inchangé. */
  imageUrl?: string;
}

/**
 * Fond des en-têtes de page (accueil, Comprendre, Veille juridique,
 * Glossaire, À propos) : image déposée par la rédactrice si renseignée,
 * assombrie pour que le texte blanc par-dessus reste lisible — sinon le
 * fond bleu nuit uni à motif de grille déjà utilisé partout ailleurs.
 */
export function HeroBackdrop({ imageUrl }: HeroBackdropProps) {
  if (imageUrl) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element -- fichier réellement uploadé sur disque local ou Vercel Blob (voir app/api/upload/route.ts), pas une image distante à optimiser. */}
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div className="bg-navy-950/75 absolute inset-0" aria-hidden />
      </>
    );
  }

  return (
    <div className="bg-grid-navy absolute inset-0 opacity-40" aria-hidden />
  );
}
