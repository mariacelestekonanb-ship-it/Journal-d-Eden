import { Card, CardContent } from "@/components/ui/card";

/**
 * Squelette de chargement au format `KnowledgeCard` — purement visuel
 * (`animate-pulse`), affiché pendant le filtrage/tri de « Toutes les
 * fiches » avant qu'une vraie requête réseau ne remplace ce délai simulé.
 */
export function SkeletonCard() {
  return (
    <Card aria-hidden className="h-full animate-pulse">
      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-2">
          <div className="bg-secondary h-5 w-20 rounded-full" />
          <div className="bg-secondary h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="bg-secondary h-4 w-full rounded-full" />
          <div className="bg-secondary h-4 w-4/5 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="bg-secondary h-3.5 w-full rounded-full" />
          <div className="bg-secondary h-3.5 w-3/5 rounded-full" />
        </div>
        <div className="flex gap-4 pt-2">
          <div className="bg-secondary h-3 w-14 rounded-full" />
          <div className="bg-secondary h-3 w-24 rounded-full" />
        </div>
        <div className="bg-secondary h-9 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}
