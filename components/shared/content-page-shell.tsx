import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";

export interface ContentPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}

/**
 * Squelette commun aux pages de contenu filtrable (Comprendre, Veille
 * juridique, Glossaire, Ressources) : en-tête de page, recherche et zone de
 * résultats. Tant que les données réelles ne sont pas branchées, la zone de
 * résultats affiche un `EmptyState` ; brancher un vrai listing revient à
 * remplacer ce seul `EmptyState` par le contenu filtré.
 */
export function ContentPageShell({
  eyebrow,
  title,
  description,
  searchPlaceholder,
  icon,
  emptyTitle,
  emptyDescription,
}: ContentPageShellProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Section>
        <SearchInput
          size="lg"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          containerClassName="mx-auto max-w-xl"
        />
        <EmptyState
          icon={icon}
          headingAs="h2"
          title={emptyTitle}
          description={emptyDescription}
          className="mt-12"
        />
      </Section>
    </>
  );
}
