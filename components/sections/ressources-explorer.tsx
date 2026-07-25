"use client";

import * as React from "react";
import { ExternalLink, FileText } from "lucide-react";

import { SearchBar } from "@/components/sections/search-bar";
import { DomaineFilter } from "@/components/sections/domaine-filter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { labelDomaine } from "@/lib/format";
import type { FiltreDomaine, Ressource } from "@/types";

export function RessourcesExplorer({ ressources }: { ressources: Ressource[] }) {
  const [recherche, setRecherche] = React.useState("");
  const [domaine, setDomaine] = React.useState<FiltreDomaine>("tous");

  const resultats = React.useMemo(() => {
    const query = recherche.trim().toLowerCase();

    return ressources.filter((ressource) => {
      const matchDomaine = domaine === "tous" || ressource.domaine === domaine;
      const matchRecherche =
        query.length === 0 ||
        ressource.titre.toLowerCase().includes(query) ||
        ressource.organisme.toLowerCase().includes(query);

      return matchDomaine && matchRecherche;
    });
  }, [ressources, recherche, domaine]);

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <SearchBar
          value={recherche}
          onChange={setRecherche}
          placeholder="Rechercher un texte, un organisme…"
          className="max-w-xl"
        />
        <DomaineFilter value={domaine} onChange={setDomaine} />
      </div>

      {resultats.length > 0 ? (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {resultats.map((ressource) => (
            <Card
              key={ressource.titre}
              className="justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-accent">
                    <FileText className="size-5" />
                  </div>
                  <Badge
                    variant={
                      ressource.domaine === "droit-spatial" ? "navy" : "accent"
                    }
                  >
                    {labelDomaine(ressource.domaine)}
                  </Badge>
                </div>

                <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-foreground">
                  {ressource.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {ressource.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {ressource.organisme}
                  </p>
                  <p>{ressource.type}</p>
                </div>
                <a
                  href={ressource.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1.5 text-sm font-medium text-navy-900 transition-colors hover:text-gold-600"
                >
                  Consulter
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          Aucune ressource ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
