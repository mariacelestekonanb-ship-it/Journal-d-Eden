import Link from "next/link";

import { Section } from "@/components/ui/section";
import { SearchInput } from "@/components/ui/search-input";

const exampleQuestions = [
  "Peut-on acheter un terrain sur la Lune ?",
  "À qui appartient l'espace ?",
  "Une entreprise privée peut-elle lancer une fusée ?",
];

/**
 * Barre de recherche de l'accueil. Formulaire natif (GET vers
 * `/comprendre`) : aucune interactivité JavaScript n'est nécessaire, la
 * recherche fonctionne au clavier comme au clic, sans composant client.
 */
export function SearchSection() {
  return (
    <Section spacing="lg">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <form
          action="/comprendre"
          method="GET"
          role="search"
          className="w-full"
        >
          <SearchInput
            size="lg"
            name="q"
            placeholder="Que souhaitez-vous comprendre ?"
          />
        </form>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {exampleQuestions.map((question) => (
            <li key={question}>
              <Link
                href={`/comprendre?q=${encodeURIComponent(question)}`}
                className="border-border hover:border-accent/50 hover:bg-secondary text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex rounded-full border px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {question}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
