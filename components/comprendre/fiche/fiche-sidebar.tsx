import { ArrowUp, ChevronDown } from "lucide-react";

import { Divider } from "@/components/ui/divider";
import {
  TableOfContents,
  type TocItem,
} from "@/components/shared/table-of-contents";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { formatDate } from "@/lib/format";

export interface FicheSidebarProps {
  tocItems: TocItem[];
  articleId: string;
  tempsLecture: number;
  dateMiseAJour: string;
}

function SidebarContent({
  tocItems,
  articleId,
  tempsLecture,
  dateMiseAJour,
}: FicheSidebarProps) {
  return (
    <>
      <TableOfContents items={tocItems} />
      <Divider className="my-6" />
      <ReadingProgress targetId={articleId} />
      <Divider className="my-6" />
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Temps estimé</dt>
          <dd className="text-foreground font-medium">{tempsLecture} min</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Dernière mise à jour</dt>
          <dd className="text-foreground font-medium">
            {formatDate(dateMiseAJour)}
          </dd>
        </div>
      </dl>
      <Divider className="my-6" />
      <a
        href="#top"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowUp className="size-4" aria-hidden />
        Retour en haut
      </a>
    </>
  );
}

/**
 * Barre latérale de la fiche : sommaire, progression de lecture, métadonnées
 * et retour en haut. Fixe (sticky) sur desktop ; repliée dans un `<details>`
 * natif sur mobile — accessible et pliable sans JavaScript supplémentaire
 * pour le repli lui-même.
 */
export function FicheSidebar(props: FicheSidebarProps) {
  return (
    <>
      <aside className="border-border bg-card sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border p-6 lg:block">
        <SidebarContent {...props} />
      </aside>

      <details className="border-border bg-card group rounded-xl border p-5 lg:hidden">
        <summary className="text-foreground focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between rounded-md text-sm font-medium focus-visible:ring-2 focus-visible:outline-none">
          Sommaire et progression
          <ChevronDown
            aria-hidden
            className="text-muted-foreground size-4 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="mt-5">
          <SidebarContent {...props} />
        </div>
      </details>
    </>
  );
}
