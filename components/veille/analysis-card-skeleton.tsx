/** Carte de chargement (squelette) pour la grille d'analyses — CSS pur (`animate-pulse`). */
export function AnalysisCardSkeleton() {
  return (
    <div
      aria-hidden
      className="border-border bg-card animate-pulse rounded-2xl border p-6"
    >
      <div className="flex items-center justify-between">
        <div className="bg-secondary h-4 w-20 rounded-full" />
        <div className="bg-secondary h-5 w-16 rounded-full" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="bg-secondary h-5 w-24 rounded-full" />
        <div className="bg-secondary h-4 w-28 rounded-full" />
      </div>
      <div className="bg-secondary mt-4 h-5 w-full rounded-full" />
      <div className="bg-secondary mt-2 h-4 w-full rounded-full" />
      <div className="bg-secondary mt-2 h-4 w-2/3 rounded-full" />
      <div className="mt-6 flex items-center justify-between">
        <div className="bg-secondary h-4 w-24 rounded-full" />
        <div className="bg-secondary h-9 w-32 rounded-full" />
      </div>
    </div>
  );
}
