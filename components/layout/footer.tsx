import Link from "next/link";
import { Mail } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Paragraph } from "@/components/ui/paragraph";
import { Tag } from "@/components/ui/tag";
import { Logo } from "@/components/shared/logo";
import { footerNav, legalNav, siteConfig } from "@/lib/site-config";
import type { SocialLink } from "@/lib/admin/types";
import packageJson from "@/package.json";

interface FooterColumnProps {
  title: string;
  items: { label: string; href: string }[];
}

function FooterColumn({ title, items }: FooterColumnProps) {
  return (
    <nav aria-label={title}>
      <h2 className="font-heading text-sm font-semibold tracking-wide text-gray-400 uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="hover:text-gold-400 focus-visible:ring-gold-400 text-sm text-gray-300 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface FooterProps {
  /** Logo déposé depuis /admin/reglages (voir `SiteSettings.branding.logoUrl`). */
  logoUrl?: string;
  /** E-mail de contact — surcharge `siteConfig.email` si renseigné dans les réglages. */
  email?: string;
  /** Liens sociaux ajoutés depuis /admin/reglages — vide par défaut (aucun réseau n'est affiché tant qu'aucun n'est renseigné). */
  liensSociaux?: SocialLink[];
}

/**
 * Pied de page global : navigation secondaire, coordonnées, liens légaux et
 * numéro de version de la plateforme.
 */
export function Footer({ logoUrl, email, liensSociaux = [] }: FooterProps) {
  const contactEmail = email || siteConfig.email;

  return (
    <footer className="border-border bg-navy-950 border-t text-gray-300">
      <Section tone="navy" spacing="none" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo inverted logoUrl={logoUrl} />
            <Paragraph size="sm" className="max-w-sm text-gray-400">
              {siteConfig.description}
            </Paragraph>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${contactEmail}`}
                className="hover:border-gold-400/60 hover:text-gold-400 focus-visible:ring-gold-400 flex size-9 items-center justify-center rounded-full border border-white/10 text-gray-300 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Envoyer un email"
              >
                <Mail className="size-4" aria-hidden />
              </a>
              {liensSociaux.map((lien) => (
                <a
                  key={lien.href}
                  href={lien.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:border-gold-400/60 hover:text-gold-400 focus-visible:ring-gold-400 flex h-9 items-center rounded-full border border-white/10 px-3 text-xs font-medium text-gray-300 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {lien.label}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Plateforme" items={footerNav.plateforme} />
          <FooterColumn title="Ressources" items={footerNav.ressources} />
          <FooterColumn title="Contact" items={footerNav.contact} />
        </div>
      </Section>

      <div className="border-t border-white/10">
        <Section tone="navy" spacing="none" className="py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. Tous droits
              réservés.
            </p>
            <nav aria-label="Liens légaux" className="flex items-center gap-5">
              {legalNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-gold-400 focus-visible:ring-gold-400 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Tag className="bg-white/5 text-gray-400">
              v{packageJson.version}
            </Tag>
          </div>
        </Section>
      </div>
    </footer>
  );
}
