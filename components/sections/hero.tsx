import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  { value: "120+", label: "analyses juridiques publiées" },
  { value: "2", label: "domaines de droit couverts" },
  { value: "Hebdo", label: "veille mise à jour" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="bg-grid-navy absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gold-500/20 blur-[140px]"
        aria-hidden
      />

      <div className="container-lexwatch relative flex flex-col items-center py-24 text-center sm:py-32">
        <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-200 backdrop-blur">
          <Sparkles className="size-3.5 text-gold-400" />
          Droit spatial &amp; droit du numérique, décryptés
        </span>

        <h1 className="animate-fade-up mt-8 max-w-3xl text-balance font-heading text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
          La veille juridique qui éclaire{" "}
          <span className="text-gold-400">l&apos;espace</span> et le{" "}
          <span className="text-gold-400">numérique</span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-2xl text-balance text-lg leading-relaxed text-gray-300"
          style={{ animationDelay: "0.1s" }}
        >
          LexWatch traduit en clair les traités, règlements et jurisprudences
          qui façonnent le droit spatial et le droit du numérique — pour les
          professionnels, chercheurs et curieux.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "0.2s" }}
        >
          <Button asChild variant="accent" size="lg">
            <Link href="/veille-juridique">
              Explorer la veille
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Link href="/comprendre">Comprendre les fondamentaux</Link>
          </Button>
        </div>

        <dl
          className="animate-fade-up mt-20 grid w-full max-w-2xl grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-3"
          style={{ animationDelay: "0.3s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <dt className="font-heading text-3xl font-bold text-gold-400">
                {stat.value}
              </dt>
              <dd className="text-sm text-gray-400">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
