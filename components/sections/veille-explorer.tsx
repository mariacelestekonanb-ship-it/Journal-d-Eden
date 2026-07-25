"use client";

import * as React from "react";

import { SearchBar } from "@/components/sections/search-bar";
import { DomaineFilter } from "@/components/sections/domaine-filter";
import { VeilleCard } from "@/components/cards/veille-card";
import type { FiltreDomaine, VeilleItem } from "@/types";

export function VeilleExplorer({ items }: { items: VeilleItem[] }) {
  const [recherche, setRecherche] = React.useState("");
  const [domaine, setDomaine] = React.useState<FiltreDomaine>("tous");

  const resultats = React.useMemo(() => {
    const query = recherche.trim().toLowerCase();

    return [...items]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .filter((item) => {
        const matchDomaine = domaine === "tous" || item.domaine === domaine;
        const matchRecherche =
          query.length === 0 ||
          item.titre.toLowerCase().includes(query) ||
          item.resume.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query);

        return matchDomaine && matchRecherche;
      });
  }, [items, recherche, domaine]);

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <SearchBar
          value={recherche}
          onChange={setRecherche}
          placeholder="Rechercher une actualité, une source…"
          className="max-w-xl"
        />
        <DomaineFilter value={domaine} onChange={setDomaine} />
      </div>

      {resultats.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((item) => (
            <VeilleCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          Aucune actualité ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
