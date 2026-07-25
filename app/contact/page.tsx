import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";

import { PageHeader } from "@/components/sections/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe LexWatch pour une question, une demande de veille personnalisée ou une proposition de collaboration.",
};

const infos = [
  {
    icon: Mail,
    titre: "E-mail",
    valeur: siteConfig.email,
  },
  {
    icon: Clock,
    titre: "Délai de réponse",
    valeur: "Sous 48 heures ouvrées",
  },
  {
    icon: MapPin,
    titre: "Zone de couverture",
    valeur: "Union européenne et international",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Une question, un projet de veille ?"
        description="Notre équipe éditoriale vous répond pour toute question sur le droit spatial, le droit du numérique ou une demande de veille personnalisée."
      />

      <section className="py-16 sm:py-20">
        <div className="container-lexwatch grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {infos.map((info) => (
              <div
                key={info.titre}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-accent">
                  <info.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {info.titre}
                  </p>
                  <p className="mt-1 font-heading text-base font-semibold text-foreground">
                    {info.valeur}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
