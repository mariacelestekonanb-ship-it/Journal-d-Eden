"use client";

import * as React from "react";

import { SearchBar } from "@/components/sections/search-bar";
import { DomaineFilter } from "@/components/sections/domaine-filter";
import { QuestionCard } from "@/components/cards/question-card";
import type { FiltreDomaine, QuestionItem } from "@/types";

export function ComprendreExplorer({
  questions,
}: {
  questions: QuestionItem[];
}) {
  const [recherche, setRecherche] = React.useState("");
  const [domaine, setDomaine] = React.useState<FiltreDomaine>("tous");

  const resultats = React.useMemo(() => {
    const query = recherche.trim().toLowerCase();

    return questions.filter((item) => {
      const matchDomaine = domaine === "tous" || item.domaine === domaine;
      const matchRecherche =
        query.length === 0 ||
        item.question.toLowerCase().includes(query) ||
        item.reponseCourte.toLowerCase().includes(query);

      return matchDomaine && matchRecherche;
    });
  }, [questions, recherche, domaine]);

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <SearchBar
          value={recherche}
          onChange={setRecherche}
          placeholder="Rechercher une question…"
          className="max-w-xl"
        />
        <DomaineFilter value={domaine} onChange={setDomaine} />
      </div>

      {resultats.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((item) => (
            <QuestionCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          Aucune question ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
