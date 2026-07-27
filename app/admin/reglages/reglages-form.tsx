"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Check } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionTabs } from "@/components/admin/content/section-tabs";
import { ValidationSummary } from "@/components/admin/content/validation-summary";
import { MediaUploadField } from "@/components/admin/content/media-upload-field";
import { BlockEditor } from "@/components/admin/editor/block-editor";
import { saveSiteSettings } from "@/lib/admin/site-settings-actions";
import { formatDate } from "@/lib/format";
import { PALETTE_LABELS, PALETTE_SWATCHES } from "@/lib/color-palettes";
import {
  COLOR_PALETTES,
  type AdminBlock,
  type HeroMedia,
  type SiteSettings,
  type SocialLink,
} from "@/lib/admin/types";

export interface ReglagesFormProps {
  settings: SiteSettings;
}

const TABS = [
  { id: "identite" as const, label: "Identité" },
  { id: "accueil" as const, label: "Page d'accueil" },
  { id: "contact" as const, label: "Contact" },
  { id: "legal" as const, label: "Pages légales" },
];

type TabId = (typeof TABS)[number]["id"];

/**
 * Formulaire unique des réglages du site, structuré en onglets plutôt
 * qu'en une seule longue page — même principe que les formulaires de
 * contenu (voir `fiche-form.tsx`), mais sans workflow de statut ni
 * historique : les réglages sont toujours « en vigueur », il n'y a rien à
 * publier séparément.
 */
export function ReglagesForm({ settings }: ReglagesFormProps) {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabId>("identite");
  const [form, setForm] = React.useState<SiteSettings>(settings);
  const [isPending, startTransition] = React.useTransition();
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const checks = [
    {
      label: "Un titre pour le héros de l'accueil",
      valid: form.hero.headline.trim().length > 0,
    },
    {
      label: "Une adresse e-mail de contact valide",
      valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.email.trim()),
    },
  ];
  const isValid = checks.every((check) => check.valid);

  function handleSave() {
    startTransition(async () => {
      await saveSiteSettings(form);
      setSavedAt(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Heading as="h1" size="lg">
            Réglages du site
          </Heading>
          <Paragraph tone="muted" className="mt-1">
            Identité visuelle, page d&apos;accueil, contact et pages légales —
            visibles immédiatement sur le site public après enregistrement.
          </Paragraph>
          <p className="text-muted-foreground mt-2 text-xs">
            Dernière modification le {formatDate(settings.updatedAt)} par{" "}
            {settings.updatedBy}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {savedAt ? (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Check className="size-3.5" aria-hidden />
              Enregistré à {savedAt}
            </span>
          ) : null}
          <Button
            variant="accent"
            onClick={handleSave}
            disabled={isPending || !isValid}
          >
            Enregistrer
          </Button>
        </div>
      </div>

      <ValidationSummary checks={checks} />

      <div className="space-y-6">
        <SectionTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "identite" ? (
          <IdentiteFields form={form} set={set} />
        ) : tab === "accueil" ? (
          <AccueilFields form={form} set={set} />
        ) : tab === "contact" ? (
          <ContactFields form={form} set={set} />
        ) : (
          <LegalFields form={form} set={set} />
        )}
      </div>
    </div>
  );
}

interface FieldsProps {
  form: SiteSettings;
  set: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
}

function IdentiteFields({ form, set }: FieldsProps) {
  return (
    <div className="max-w-2xl space-y-8">
      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Logo
        </Heading>
        <Paragraph tone="muted" size="sm">
          Remplace l&apos;icône et le nom actuels du site par une image. Laisser
          vide pour garder le logo par défaut.
        </Paragraph>
        <MediaUploadField
          value={
            form.branding.logoUrl
              ? { url: form.branding.logoUrl, type: "image" }
              : undefined
          }
          onChange={(value) =>
            set("branding", { ...form.branding, logoUrl: value?.url })
          }
          accept="image/*"
          placeholder="Déposer un logo"
          helperText="Format carré ou horizontal recommandé (PNG, WebP ou SVG)."
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Palette de couleurs
        </Heading>
        <Paragraph tone="muted" size="sm">
          Quatre thèmes prêts à l&apos;emploi, chacun vérifié pour rester
          lisible — pas de sélecteur de couleur libre, pour garantir le
          contraste.
        </Paragraph>
        <div
          className="grid gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Palette de couleurs"
        >
          {COLOR_PALETTES.map((palette) => {
            const [dark, accent] = PALETTE_SWATCHES[palette];
            const active = form.branding.palette === palette;
            return (
              <button
                key={palette}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set("branding", { ...form.branding, palette })}
                className={`focus-visible:ring-ring flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  active
                    ? "border-ring bg-secondary"
                    : "border-border hover:bg-secondary/50"
                }`}
              >
                <span className="flex overflow-hidden rounded-full border">
                  <span
                    className="size-6"
                    style={{ backgroundColor: dark }}
                    aria-hidden
                  />
                  <span
                    className="size-6"
                    style={{ backgroundColor: accent }}
                    aria-hidden
                  />
                </span>
                {PALETTE_LABELS[palette]}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const HERO_MEDIA_OPTIONS: { value: HeroMedia["type"]; label: string }[] = [
  { value: "illustration", label: "Illustration animée (par défaut)" },
  { value: "image", label: "Image" },
  { value: "video", label: "Vidéo" },
];

function AccueilFields({ form, set }: FieldsProps) {
  const { hero } = form;

  function setHero<K extends keyof SiteSettings["hero"]>(
    key: K,
    value: SiteSettings["hero"][K],
  ) {
    set("hero", { ...hero, [key]: value });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="hero-headline">
          Titre du héros
        </label>
        <Textarea
          id="hero-headline"
          value={hero.headline}
          onChange={(e) => setHero("headline", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="hero-description">
          Description
        </label>
        <Textarea
          id="hero-description"
          value={hero.description}
          onChange={(e) => setHero("description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="cta-primary">
            Bouton principal (vers Comprendre)
          </label>
          <Input
            id="cta-primary"
            value={hero.ctaPrimaryLabel}
            onChange={(e) => setHero("ctaPrimaryLabel", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="cta-secondaire">
            Bouton secondaire (vers Veille juridique)
          </label>
          <Input
            id="cta-secondaire"
            value={hero.ctaSecondaireLabel}
            onChange={(e) => setHero("ctaSecondaireLabel", e.target.value)}
          />
        </div>
      </div>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Média du héros
        </Heading>
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Type de média du héros"
        >
          {HERO_MEDIA_OPTIONS.map((option) => {
            const active = hero.media.type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() =>
                  setHero("media", {
                    type: option.value,
                    url:
                      option.value === "illustration"
                        ? undefined
                        : hero.media.url,
                  })
                }
                className={`focus-visible:ring-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  active
                    ? "bg-navy-900 border-transparent text-white"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {hero.media.type !== "illustration" ? (
          <MediaUploadField
            value={
              hero.media.url
                ? { url: hero.media.url, type: hero.media.type }
                : undefined
            }
            onChange={(value) =>
              setHero("media", {
                type: hero.media.type,
                url: value?.url,
              })
            }
            accept={hero.media.type === "video" ? "video/*" : "image/*"}
            placeholder={
              hero.media.type === "video"
                ? "Déposer une vidéo"
                : "Déposer une image"
            }
            helperText="Remplace l'illustration animée par défaut dans le héros de l'accueil."
          />
        ) : (
          <Paragraph tone="muted" size="sm">
            L&apos;illustration vectorielle actuelle reste affichée tant
            qu&apos;aucune image ou vidéo n&apos;est déposée.
          </Paragraph>
        )}
      </section>
    </div>
  );
}

function ContactFields({ form, set }: FieldsProps) {
  const { contact } = form;

  function updateLien(index: number, patch: Partial<SocialLink>) {
    const liensSociaux = contact.liensSociaux.map((lien, i) =>
      i === index ? { ...lien, ...patch } : lien,
    );
    set("contact", { ...contact, liensSociaux });
  }

  function removeLien(index: number) {
    set("contact", {
      ...contact,
      liensSociaux: contact.liensSociaux.filter((_, i) => i !== index),
    });
  }

  function addLien() {
    set("contact", {
      ...contact,
      liensSociaux: [...contact.liensSociaux, { label: "", href: "" }],
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="contact-email">
          E-mail de contact
        </label>
        <Input
          id="contact-email"
          type="email"
          value={contact.email}
          onChange={(e) =>
            set("contact", { ...contact, email: e.target.value })
          }
        />
        <p className="text-muted-foreground text-xs">
          Affiché en pied de page et sur la page Contact.
        </p>
      </div>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Réseaux sociaux
        </Heading>
        <Paragraph tone="muted" size="sm">
          Liens affichés en pied de page, à côté de l&apos;e-mail de contact.
        </Paragraph>
        <div className="space-y-3">
          {contact.liensSociaux.map((lien, index) => (
            <div
              key={index}
              className="border-border flex items-start gap-2 rounded-xl border p-4"
            >
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <Input
                  value={lien.label}
                  onChange={(e) => updateLien(index, { label: e.target.value })}
                  placeholder="Nom (ex. LinkedIn)"
                  aria-label="Nom du réseau"
                />
                <Input
                  value={lien.href}
                  onChange={(e) => updateLien(index, { href: e.target.value })}
                  placeholder="https://…"
                  aria-label="Lien du réseau"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive size-9 shrink-0"
                onClick={() => removeLien(index)}
                aria-label="Retirer ce lien"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addLien}>
            <Plus className="size-4" aria-hidden />
            Ajouter un réseau social
          </Button>
        </div>
      </section>
    </div>
  );
}

function LegalFields({ form, set }: FieldsProps) {
  const { legal } = form;

  function setLegal(key: keyof SiteSettings["legal"], value: AdminBlock[]) {
    set("legal", { ...legal, [key]: value });
  }

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Mentions légales
        </Heading>
        <Paragraph tone="muted" size="sm">
          Remplace l&apos;état « cette page arrive bientôt » dès qu&apos;un
          contenu est renseigné ici.
        </Paragraph>
        <BlockEditor
          value={legal.mentionsLegales}
          onChange={(blocks) => setLegal("mentionsLegales", blocks)}
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Politique de confidentialité
        </Heading>
        <BlockEditor
          value={legal.confidentialite}
          onChange={(blocks) => setLegal("confidentialite", blocks)}
        />
      </section>
    </div>
  );
}
