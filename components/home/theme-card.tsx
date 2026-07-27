import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export interface ThemeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

/**
 * Grande carte thématique de l'accueil : icône, titre, description et
 * animation au survol, entièrement en CSS (aucun JavaScript nécessaire).
 */
export function ThemeCard({
  icon: Icon,
  title,
  description,
  href,
}: ThemeCardProps) {
  return (
    <Link
      href={href}
      className="focus-visible:ring-ring group focus-visible:ring-offset-background block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <Card className="hover:border-accent/40 h-full justify-between p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="bg-navy-900 group-hover:bg-accent group-hover:text-accent-foreground flex size-12 items-center justify-center rounded-xl text-white transition-colors">
          <Icon className="size-6" aria-hidden />
        </div>

        <div className="mt-6">
          <Heading as="h3" size="sm">
            {title}
          </Heading>
          <Paragraph tone="muted" size="sm" className="mt-2">
            {description}
          </Paragraph>
        </div>

        <ArrowUpRight
          aria-hidden
          className="text-muted-foreground mt-6 size-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </Card>
    </Link>
  );
}
