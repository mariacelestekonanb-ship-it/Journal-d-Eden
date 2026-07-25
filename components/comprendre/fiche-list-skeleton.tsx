/**
 * Ligne de chargement (squelette) pour « Toutes les fiches ». Purement en
 * CSS (`animate-pulse`) : aucune interactivité, réutilisable dans n'importe
 * quel contexte de chargement de la bibliothèque.
 */
export function FicheListSkeleton() {
  return (
    <div
      aria-hidden
      className="border-border animate-pulse border-b px-4 py-6 last:border-none"
    >
      <div className="flex gap-2">
        <div className="bg-secondary h-5 w-20 rounded-full" />
        <div className="bg-secondary h-5 w-16 rounded-full" />
      </div>
      <div className="bg-secondary mt-3 h-4 w-3/4 rounded-full" />
      <div className="bg-secondary mt-2 h-3.5 w-1/2 rounded-full" />
    </div>
  );
}
