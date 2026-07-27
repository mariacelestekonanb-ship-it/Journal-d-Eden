import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paragraph } from "@/components/ui/paragraph";
import { formatDate } from "@/lib/format";
import type { Revision } from "@/lib/admin/types";

export interface RevisionCompareProps {
  a: Revision;
  b: Revision;
}

/**
 * Comparaison de deux versions. Aucun stockage réel n'existe encore par
 * version (voir `Revision` dans `lib/admin/types.ts`) : ce composant
 * compare donc les métadonnées disponibles (auteur, date, résumé) et
 * documente ce qu'une vraie comparaison de contenu ajouterait — le tableau
 * de blocs sérialisés (`AdminBlock[]`) de chaque version, diffé bloc par
 * bloc, une fois une source de données réelle branchée.
 */
export function RevisionCompare({ a, b }: RevisionCompareProps) {
  const [plusAncienne, plusRecente] =
    new Date(a.date).getTime() <= new Date(b.date).getTime() ? [a, b] : [b, a];

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2 text-base">
          Comparaison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          {[plusAncienne, plusRecente].map((version, index) => (
            <div key={version.id} className="contents sm:block">
              {index === 1 ? (
                <ArrowRight
                  aria-hidden
                  className="text-muted-foreground mx-auto hidden size-5 sm:block"
                />
              ) : null}
              <div className="border-border rounded-xl border p-4">
                <p className="text-muted-foreground text-xs">
                  {formatDate(version.date)}
                </p>
                <p className="mt-1 text-sm font-medium">{version.auteur}</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {version.resume}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Paragraph
          tone="muted"
          size="sm"
          className="border-border border-t pt-4"
        >
          Cette vue ne compare aujourd&apos;hui que les métadonnées de version.
          Une fois une source de contenu réelle connectée, chaque révision
          conservera son propre tableau de blocs sérialisés (
          <code className="text-xs">AdminBlock[]</code>), permettant une
          comparaison bloc par bloc à cet endroit.
        </Paragraph>
      </CardContent>
    </Card>
  );
}
