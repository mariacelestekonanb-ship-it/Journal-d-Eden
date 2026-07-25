import Link from "next/link";
import { Scale, Mail } from "lucide-react";

import { footerNav, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-950 text-gray-300">
      <div className="container-lexwatch grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading text-lg font-bold text-white"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-gold-400">
              <Scale className="size-4.5" />
            </span>
            {siteConfig.name}
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-gray-400">
            {siteConfig.description}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Envoyer un email"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-gray-300 transition-colors hover:border-gold-400/60 hover:text-gold-400"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <FooterColumn title="Plateforme" items={footerNav.plateforme} />
        <FooterColumn title="Ressources" items={footerNav.ressources} />
        <FooterColumn title="Contact" items={footerNav.contact} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-lexwatch flex flex-col items-center justify-between gap-3 py-6 text-xs text-gray-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits
            réservés.
          </p>
          <p>Contenus fournis à titre informatif — ne constituent pas un avis juridique.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-gray-300 transition-colors hover:text-gold-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
