import type { Metadata } from "next";
import { Mail, Clock, MapPin, Send } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";
import { buildWebPageJsonLd } from "@/lib/json-ld";
import { siteSettingsStore } from "@/lib/admin/repository";

const TITLE = "Contact";
const DESCRIPTION =
  "Contactez l'équipe LexWatch pour une question, une demande de veille personnalisée ou une proposition de collaboration.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await siteSettingsStore.get();
  const infos = [
    {
      icon: Mail,
      titre: "E-mail",
      valeur: settings.contact.email || siteConfig.email,
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

  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/contact",
        })}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
      />
      <PageHeader
        eyebrow="Contact"
        title="Une question, un projet de veille ?"
        description="Notre équipe éditoriale vous répond pour toute question sur le droit spatial, le droit du numérique ou une demande de veille personnalisée."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {infos.map((info) => (
              <Card key={info.titre} className="flex-row items-start gap-4 p-6">
                <span className="bg-navy-900 text-accent flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <info.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <Paragraph size="sm" tone="muted">
                    {info.titre}
                  </Paragraph>
                  <Heading as="h2" size="xs" className="mt-1">
                    {info.valeur}
                  </Heading>
                </div>
              </Card>
            ))}
          </div>

          <Card
            className="p-8"
            aria-label="Formulaire de contact — bientôt disponible"
          >
            <form className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="nom"
                    className="text-foreground text-sm font-medium"
                  >
                    Nom complet
                  </label>
                  <Input id="nom" name="nom" placeholder="Jeanne Dupont" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-foreground text-sm font-medium"
                  >
                    Adresse e-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jeanne.dupont@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="sujet"
                  className="text-foreground text-sm font-medium"
                >
                  Sujet
                </label>
                <Input
                  id="sujet"
                  name="sujet"
                  placeholder="Demande de veille personnalisée"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-foreground text-sm font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Décrivez votre demande…"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 w-full rounded-xl border px-5 py-4 text-sm shadow-xs outline-none focus-visible:ring-2"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
                disabled
              >
                Envoyer le message
                <Send className="size-4" aria-hidden />
              </Button>
              <Paragraph size="sm" tone="muted">
                L&apos;envoi du formulaire sera activé prochainement.
              </Paragraph>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
