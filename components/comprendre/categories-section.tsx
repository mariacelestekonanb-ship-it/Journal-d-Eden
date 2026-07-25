import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { CategoryCard } from "@/components/comprendre/category-card";
import { themes } from "@/data/themes";

export interface CategoriesSectionProps {
  activeTheme?: string;
}

/** Section « Catégories » : les cinq grandes entrées de la bibliothèque. */
export function CategoriesSection({ activeTheme }: CategoriesSectionProps) {
  return (
    <Section tone="muted">
      <div className="mx-auto max-w-2xl text-center">
        <Heading as="h2" size="lg">
          Catégories
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4">
          Choisissez un thème pour filtrer directement la bibliothèque de fiches
          ci-dessous.
        </Paragraph>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <CategoryCard
            key={theme.slug}
            theme={theme}
            active={theme.slug === activeTheme}
          />
        ))}
      </div>
    </Section>
  );
}
