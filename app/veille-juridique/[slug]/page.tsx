import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { veilleItems } from "@/data/veille";
import { formatDate, labelDomaine } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return veilleItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = veilleItems.find((veille) => veille.slug === slug);

  if (!item) {
    return { title: "Actualité introuvable" };
  }

  return {
    title: item.titre,
    description: item.resume,
  };
}

export default async function VeilleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = veilleItems.find((veille) => veille.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <article className="py-16 sm:py-20">
      <div className="container-lexwatch max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href="/veille-juridique">
            <ArrowLeft className="size-4" />
            Retour à la veille
          </Link>
        </Button>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <Badge variant="outline">{item.source}</Badge>
        </div>

        <h1 className="mt-6 text-balance font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {item.titre}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {item.tempsLecture} min de lecture
          </span>
        </div>

        <p className="mt-8 text-lg leading-relaxed text-foreground">
          {item.resume}
        </p>

        <div className="mt-10 space-y-6">
          {item.contenu.map((paragraphe, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-muted-foreground"
            >
              {paragraphe}
            </p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-muted/60 p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Points clés
          </h2>
          <ul className="mt-4 space-y-3">
            {item.pointsCles.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
