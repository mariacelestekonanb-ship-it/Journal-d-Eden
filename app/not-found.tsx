import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-lexwatch flex flex-col items-center py-32 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-navy-900 text-accent">
        <Compass className="size-7" />
      </span>
      <h1 className="mt-8 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Page introuvable
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Button asChild variant="accent" size="lg" className="mt-8">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
