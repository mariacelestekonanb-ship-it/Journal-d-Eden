import Link from "next/link";
import { SearchX, ArrowRight, BookMarked, Library } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { questions } from "@/data/questions";

export interface EmptySearchStateProps {
  query: string;
  onNavigate: () => void;
}

/**
 * État « aucun résultat » de la recherche globale : plutôt qu'une impasse,
 * propose des questions populaires réelles et des raccourcis vers le
 * Glossaire et Comprendre pour continuer à explorer LexWatch.
 */
export function EmptySearchState({ query, onNavigate }: EmptySearchStateProps) {
  const suggestions = questions.slice(0, 3);

  return (
    <div className="px-2 py-6 text-center">
      <span
        aria-hidden
        className="bg-secondary text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-full"
      >
        <SearchX className="size-5" />
      </span>
      <Heading as="h3" size="sm" className="mt-4">
        Aucun résultat trouvé.
      </Heading>
      <Paragraph tone="muted" size="sm" className="mt-2">
        Aucun contenu ne correspond à « {query} ». Essayez un autre terme, ou
        explorez :
      </Paragraph>

      <div className="mt-6 text-left">
        <p className="text-muted-foreground px-3 text-xs font-medium tracking-wide uppercase">
          Questions populaires
        </p>
        <ul className="mt-2 space-y-1">
          {suggestions.map((question) => (
            <li key={question.slug}>
              <Link
                href={`/comprendre/${question.slug}`}
                onClick={onNavigate}
                className="hover:bg-secondary focus-visible:ring-ring flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="line-clamp-1">{question.question}</span>
                <ArrowRight
                  aria-hidden
                  className="text-muted-foreground size-3.5 shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <Link
          href="/glossaire"
          onClick={onNavigate}
          className="border-border hover:bg-secondary focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <BookMarked className="size-4" aria-hidden />
          Glossaire
        </Link>
        <Link
          href="/comprendre"
          onClick={onNavigate}
          className="border-border hover:bg-secondary focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <Library className="size-4" aria-hidden />
          Comprendre
        </Link>
      </div>
    </div>
  );
}
