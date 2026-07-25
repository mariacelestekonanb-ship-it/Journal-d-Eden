import type { Metadata } from "next";
import { Compass, Users, BookMarked, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/sections/page-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "La mission de LexWatch : rendre accessible le droit spatial et le droit du numérique à travers une veille juridique rigoureuse et pédagogique.",
};

const valeurs = [
  {
    icon: Compass,
    titre: "Rigueur",
    description:
      "Chaque analyse s'appuie sur les textes officiels et les sources primaires, sans raccourci ni approximation.",
  },
  {
    icon: BookMarked,
    titre: "Pédagogie",
    description:
      "Le droit spatial et le droit du numérique expliqués sans jargon, accessibles aux non-spécialistes comme aux experts.",
  },
  {
    icon: ShieldCheck,
    titre: "Indépendance",
    description:
      "Une ligne éditoriale indépendante, guidée par la seule exigence de clarté et d'exactitude juridique.",
  },
  {
    icon: Users,
    titre: "Communauté",
    description:
      "Une plateforme conçue avec et pour les professionnels, chercheurs et curieux du droit des nouvelles frontières.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title="Deux frontières juridiques, une seule exigence de clarté"
        description={`${siteConfig.name} est né d'un constat simple : le droit spatial et le droit du numérique évoluent plus vite que la capacité du plus grand nombre à les comprendre.`}
      />

      <section className="py-20 sm:py-24">
        <div className="container-lexwatch grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Notre mission
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Le droit spatial, longtemps réservé à un cercle restreint de
              diplomates et de juristes, s&apos;ouvre aujourd&apos;hui à une
              multitude d&apos;acteurs privés. Le droit du numérique, lui,
              s&apos;impose désormais à chaque organisation, quelle que soit
              sa taille.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {siteConfig.name} vulgarise ces deux disciplines en pleine
              expansion à travers une veille juridique rigoureuse, un
              glossaire précis et des ressources vérifiées — pour que la
              complexité du droit ne soit jamais un obstacle à sa
              compréhension.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-to-br from-navy-950 to-navy-800 p-10 text-white">
            <p className="font-heading text-2xl font-semibold leading-snug">
              &laquo; Rendre le droit spatial et le droit du numérique aussi
              lisibles que les enjeux qu&apos;ils encadrent sont
              considérables. &raquo;
            </p>
            <p className="mt-6 text-sm text-gray-400">
              L&apos;équipe éditoriale {siteConfig.name}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40 py-20 sm:py-24">
        <div className="container-lexwatch">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Nos valeurs
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valeurs.map((valeur) => (
              <div
                key={valeur.titre}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-navy-900 text-accent">
                  <valeur.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                  {valeur.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {valeur.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
