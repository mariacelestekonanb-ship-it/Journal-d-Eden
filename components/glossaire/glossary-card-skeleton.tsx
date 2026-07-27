/** Squelette de chargement d'une `GlossaryCard` — CSS pur (`animate-pulse`). */
export function GlossaryCardSkeleton() {
  return (
    <div
      aria-hidden
      className="border-border bg-card animate-pulse rounded-xl border p-6"
    >
      <div className="bg-secondary h-5 w-24 rounded-full" />
      <div className="bg-secondary mt-3 h-5 w-2/3 rounded-full" />
      <div className="mt-3 space-y-2">
        <div className="bg-secondary h-3 w-full rounded-full" />
        <div className="bg-secondary h-3 w-full rounded-full" />
        <div className="bg-secondary h-3 w-1/2 rounded-full" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="bg-secondary h-3 w-28 rounded-full" />
        <div className="bg-secondary h-8 w-32 rounded-full" />
      </div>
    </div>
  );
}
