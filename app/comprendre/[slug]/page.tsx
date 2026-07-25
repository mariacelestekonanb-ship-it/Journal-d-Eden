import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questions } from "@/data/questions";
import { labelDomaine } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return questions.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = questions.find((question) => question.slug === slug);

  if (!item) {
    return { title: "Question introuvable" };
  }

  return {
    title: item.question,
    description: item.reponseCourte,
  };
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = questions.find((question) => question.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <article className="py-16 sm:py-20">
      <div className="container-lexwatch max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href="/comprendre">
            <ArrowLeft className="size-4" />
            Retour à Comprendre
          </Link>
        </Button>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge variant={item.domaine === "droit-spatial" ? "navy" : "accent"}>
            {labelDomaine(item.domaine)}
          </Badge>
          <Badge variant="outline">{item.niveau}</Badge>
        </div>

        <h1 className="mt-6 text-balance font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {item.question}
        </h1>

        <p className="mt-6 rounded-2xl border border-border bg-muted/60 p-6 text-lg leading-relaxed text-foreground">
          {item.reponseCourte}
        </p>

        <div className="mt-10 space-y-6">
          {item.reponseDetaillee.map((paragraphe, index) => (
            <p
              key={index}
              className="flex gap-3 text-base leading-relaxed text-muted-foreground"
            >
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-accent" />
              <span>{paragraphe}</span>
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
