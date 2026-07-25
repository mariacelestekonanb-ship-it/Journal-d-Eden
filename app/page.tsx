import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Radar, ShieldCheck } from "lucide-react";

import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategorieCard } from "@/components/cards/categorie-card";
import { VeilleCard } from "@/components/cards/veille-card";
import { QuestionCard } from "@/components/cards/question-card";
import { categories } from "@/data/categories";
import { veilleItems } from "@/data/veille";
import { questions } from "@/data/questions";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "LexWatch décrypte le droit spatial et le droit du numérique : veille juridique, catégories thématiques et fondamentaux expliqués simplement.",
};

const piliers = [
  {
    icon: BookOpen,
    titre: "Comprendre",
    description:
      "Les fondamentaux du droit spatial et du droit du numérique expliqués simplement, sans jargon superflu.",
  },
  {
    icon: Radar,
    titre: "Suivre",
    description:
      "Une veille juridique hebdomadaire sur les textes, décisions et négociations internationales qui comptent.",
  },
  {
    icon: ShieldCheck,
    titre: "Approfondir",
    description:
      "Un glossaire et des ressources officielles pour aller plus loin sur chaque notion clé.",
  },
];

export default function HomePage() {
  const veilleRecente = veilleItems.slice(0, 3);
  const questionsPopulaires = questions.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="border-b border-border bg-background py-20 sm:py-24">
        <div className="container-lexwatch">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="accent">Notre approche</Badge>
            <h2 className="mt-5 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Une plateforme pensée comme un cabinet, pas comme un blog
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {piliers.map((pilier) => (
              <div
                key={pilier.titre}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-navy-900 text-accent">
                  <pilier.icon className="size-5" />
                </div>
                <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
                  {pilier.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pilier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24">
        <div className="container-lexwatch">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Badge variant="accent">Catégories</Badge>
              <h2 className="mt-5 max-w-xl text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Deux domaines, huit thématiques clés
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/veille-juridique">
                Toute la veille
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((categorie) => (
              <CategorieCard key={categorie.slug} categorie={categorie} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-lexwatch">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Badge variant="accent">Veille récente</Badge>
              <h2 className="mt-5 max-w-xl text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Les dernières actualités juridiques
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/veille-juridique">
                Voir toute la veille
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {veilleRecente.map((item) => (
              <VeilleCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24">
        <div className="container-lexwatch">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Badge variant="accent">Comprendre</Badge>
              <h2 className="mt-5 max-w-xl text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Les questions que tout le monde se pose
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/comprendre">
                Toutes les questions
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {questionsPopulaires.map((item) => (
              <QuestionCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
        <div
          className="pointer-events-none absolute right-[-10%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold-500/20 blur-[120px]"
          aria-hidden
        />
        <div className="container-lexwatch relative flex flex-col items-center text-center">
          <h2 className="max-w-xl text-balance font-heading text-3xl font-bold sm:text-4xl">
            Restez informé des évolutions du droit spatial et numérique
          </h2>
          <p className="mt-4 max-w-lg text-balance text-gray-300">
            Contactez notre équipe pour une veille personnalisée ou une
            question spécifique.
          </p>
          <Button asChild variant="accent" size="lg" className="mt-8">
            <Link href="/contact">
              Nous contacter
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
