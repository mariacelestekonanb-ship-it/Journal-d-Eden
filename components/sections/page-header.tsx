import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/60 to-background">
      <div className="container-lexwatch flex flex-col items-center py-20 text-center sm:py-24">
        <Badge variant="accent" className="mb-6">
          {eyebrow}
        </Badge>
        <h1 className="max-w-2xl text-balance font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
