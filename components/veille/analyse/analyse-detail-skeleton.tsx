import { Container } from "@/components/ui/container";

/**
 * Squelette de chargement d'une analyse — CSS pur (`animate-pulse`), affiché
 * par `app/veille-juridique/[slug]/loading.tsx` pendant le rendu serveur.
 */
export function AnalyseDetailSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="border-border border-b py-6">
        <Container>
          <div className="bg-secondary h-4 w-72 rounded-full" />
        </Container>
      </div>

      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="bg-secondary h-6 w-28 rounded-full" />
              <div className="bg-secondary h-6 w-20 rounded-full" />
            </div>
            <div className="bg-secondary h-10 w-3/4 rounded-lg" />
            <div className="bg-secondary h-4 w-full rounded-full" />
            <div className="bg-secondary h-4 w-2/3 rounded-full" />
            <div className="bg-secondary mt-6 h-28 w-full rounded-xl" />
            <div className="space-y-3 pt-4">
              <div className="bg-secondary h-4 w-full rounded-full" />
              <div className="bg-secondary h-4 w-full rounded-full" />
              <div className="bg-secondary h-4 w-5/6 rounded-full" />
            </div>
            <div className="bg-secondary mt-6 h-40 w-full rounded-xl" />
          </div>
          <div className="bg-secondary hidden h-96 rounded-xl lg:block" />
        </div>
      </Container>
    </div>
  );
}
