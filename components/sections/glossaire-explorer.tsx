"use client";

import * as React from "react";

import { SearchBar } from "@/components/sections/search-bar";
import { DomaineFilter } from "@/components/sections/domaine-filter";
import { Badge } from "@/components/ui/badge";
import { labelDomaine } from "@/lib/format";
import type { FiltreDomaine, GlossaireTerme } from "@/types";

export function GlossaireExplorer({ termes }: { termes: GlossaireTerme[] }) {
  const [recherche, setRecherche] = React.useState("");
  const [domaine, setDomaine] = React.useState<FiltreDomaine>("tous");

  const groupes = React.useMemo(() => {
    const query = recherche.trim().toLowerCase();

    const filtres = termes.filter((terme) => {
      const matchDomaine = domaine === "tous" || terme.domaine === domaine;
      const matchRecherche =
        query.length === 0 ||
        terme.terme.toLowerCase().includes(query) ||
        terme.definition.toLowerCase().includes(query);

      return matchDomaine && matchRecherche;
    });

    const parLettre = new Map<string, GlossaireTerme[]>();
    for (const terme of [...filtres].sort((a, b) =>
      a.terme.localeCompare(b.terme, "fr"),
    )) {
      const groupe = parLettre.get(terme.lettre) ?? [];
      groupe.push(terme);
      parLettre.set(terme.lettre, groupe);
    }

    return Array.from(parLettre.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
  }, [termes, recherche, domaine]);

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <SearchBar
          value={recherche}
          onChange={setRecherche}
          placeholder="Rechercher un terme…"
          className="max-w-xl"
        />
        <DomaineFilter value={domaine} onChange={setDomaine} />
      </div>

      {groupes.length > 0 ? (
        <div className="mt-14 space-y-12">
          {groupes.map(([lettre, termesGroupe]) => (
            <div key={lettre}>
              <div className="flex items-center gap-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-navy-900 font-heading text-base font-bold text-white">
                  {lettre}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                {termesGroupe.map((terme) => (
                  <div
                    key={terme.terme}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-heading text-base font-semibold text-foreground">
                        {terme.terme}
                      </dt>
                      <Badge
                        variant={
                          terme.domaine === "droit-spatial"
                            ? "navy"
                            : "accent"
                        }
                      >
                        {labelDomaine(terme.domaine)}
                      </Badge>
                    </div>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {terme.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          Aucun terme ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
