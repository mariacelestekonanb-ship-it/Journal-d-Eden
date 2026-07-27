"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { ConfirmDialog } from "@/components/admin/content/confirm-dialog";
import { SectionTabs } from "@/components/admin/content/section-tabs";
import { CoverImageField } from "@/components/admin/content/cover-image-field";
import { ValidationSummary } from "@/components/admin/content/validation-summary";
import { AutosaveIndicator } from "@/components/admin/content/autosave-indicator";
import { PreviewDialog } from "@/components/admin/content/preview-dialog";
import { SeoPanel } from "@/components/admin/content/seo-panel";
import { RevisionHistory } from "@/components/admin/revisions/revision-history";
import { saveRessource } from "@/lib/admin/ressources-actions";
import { deleteContent } from "@/lib/admin/actions";
import { labelDomaine } from "@/lib/format";
import { useAutosave } from "@/hooks/use-autosave";
import {
  ADMIN_STATUSES,
  type AdminStatus,
  type Couverture,
  type RessourceAdmin,
  type SeoMeta,
} from "@/lib/admin/types";
import type { Domaine } from "@/types";

export interface RessourceFormProps {
  ressource: RessourceAdmin | null;
}

const STATUS_LABELS: Record<AdminStatus, string> = {
  brouillon: "Brouillon",
  "en-relecture": "En relecture",
  "a-corriger": "À corriger",
  publie: "Publié",
  archive: "Archivé",
};

const DOMAINES: Domaine[] = ["droit-spatial", "droit-numerique"];
const TYPES: RessourceAdmin["type"][] = [
  "Texte officiel",
  "Rapport",
  "Guide",
  "Publication",
];

interface FormState {
  titre: string;
  description: string;
  type: RessourceAdmin["type"];
  domaine: Domaine;
  url: string;
  organisme: string;
  status: AdminStatus;
  couverture: Couverture | undefined;
  seo: SeoMeta;
}

function toFormState(ressource: RessourceAdmin | null): FormState {
  if (ressource) {
    return {
      titre: ressource.titre,
      description: ressource.description,
      type: ressource.type,
      domaine: ressource.domaine,
      url: ressource.url,
      organisme: ressource.organisme,
      status: ressource.status,
      couverture: ressource.couverture,
      seo: ressource.seo ?? {},
    };
  }

  return {
    titre: "",
    description: "",
    type: "Guide",
    domaine: "droit-spatial",
    url: "",
    organisme: "",
    status: "brouillon",
    couverture: undefined,
    seo: {},
  };
}

/** Formulaire de création/modification d'une ressource. */
export function RessourceForm({ ressource }: RessourceFormProps) {
  const router = useRouter();
  const isNew = ressource === null;
  const [form, setForm] = React.useState<FormState>(() =>
    toFormState(ressource),
  );
  const [tab, setTab] = React.useState<"contenu" | "seo" | "historique">(
    "contenu",
  );
  const [isPending, startTransition] = React.useTransition();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const { lastSavedAt } = useAutosave(
    `ressource-${ressource?.id ?? "nouveau"}`,
    form,
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const checks = [
    { label: "Un titre", valid: form.titre.trim().length > 0 },
    { label: "Une description", valid: form.description.trim().length > 0 },
    { label: "Une URL", valid: form.url.trim().length > 0 },
    { label: "Un organisme", valid: form.organisme.trim().length > 0 },
  ];
  const isValid = checks.every((check) => check.valid);

  function handleSave(status?: AdminStatus) {
    startTransition(async () => {
      const result = await saveRessource({
        id: ressource?.id,
        ...form,
        status: status ?? form.status,
      });
      if (isNew) {
        router.push(`/admin/ressources/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!ressource) return;
    startTransition(async () => {
      await deleteContent("ressource", ressource.id, ressource.titre);
      setDeleteOpen(false);
      router.push("/admin/ressources");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/ressources"
            className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Ressources
          </Link>
          <Heading as="h1" size="lg">
            {isNew ? "Nouvelle ressource" : form.titre || "Sans titre"}
          </Heading>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusBadge status={form.status} />
            {!isNew ? (
              <Paragraph tone="muted" size="sm">
                Mis à jour le {ressource.updatedAt} par {ressource.updatedBy}
              </Paragraph>
            ) : null}
            <AutosaveIndicator lastSavedAt={lastSavedAt} />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye aria-hidden />
            Aperçu
          </Button>
          {!isNew && ressource.status === "publie" ? (
            <Button variant="outline" size="sm" asChild>
              <a href="/ressources" target="_blank" rel="noreferrer">
                Voir en ligne
              </a>
            </Button>
          ) : null}
          {!isNew ? (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 aria-hidden />
              Supprimer
            </Button>
          ) : null}
          <Select
            value={form.status}
            onChange={(e) => set("status", e.target.value as AdminStatus)}
            className="w-auto"
            aria-label="Statut"
          >
            {ADMIN_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
          <Button
            size="sm"
            disabled={isPending || form.titre.trim().length === 0}
            onClick={() => handleSave()}
          >
            Enregistrer
          </Button>
          {form.status !== "publie" ? (
            <Button
              variant="accent"
              size="sm"
              disabled={isPending || !isValid}
              onClick={() => handleSave("publie")}
            >
              Publier
            </Button>
          ) : null}
        </div>
      </div>

      <ValidationSummary checks={checks} />

      <div className="space-y-6">
        <SectionTabs
          tabs={[
            { id: "contenu", label: "Contenu" },
            { id: "seo", label: "SEO" },
            ...(isNew
              ? []
              : [{ id: "historique" as const, label: "Historique" }]),
          ]}
          active={tab}
          onChange={setTab}
        />
        {tab === "contenu" ? (
          <RessourceContentFields form={form} set={set} />
        ) : tab === "seo" ? (
          <SeoPanel
            value={form.seo}
            onChange={(seo) => set("seo", seo)}
            fallbackTitle={form.titre || "Nouvelle ressource"}
            fallbackDescription={form.description}
            path="/ressources"
          />
        ) : ressource ? (
          <RevisionHistory versions={ressource.versions} />
        ) : null}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette ressource ?"
        description="Cette action est immédiate dans cette démonstration : aucune base de données réelle n'est connectée, la suppression n'est donc pas persistée durablement."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isPending={isPending}
      />

      <PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <RessourcePreview form={form} />
      </PreviewDialog>
    </div>
  );
}

interface RessourceContentFieldsProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function RessourceContentFields({ form, set }: RessourceContentFieldsProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Heading as="h2" size="sm">
          Informations générales
        </Heading>

        <CoverImageField
          value={form.couverture}
          onChange={(value) => set("couverture", value)}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="titre">
            Titre
          </label>
          <Input
            id="titre"
            value={form.titre}
            onChange={(e) => set("titre", e.target.value)}
            placeholder="Ex. Traité sur les principes régissant les activités des États"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Description
          </label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Description en une ou deux phrases"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={form.type}
              onChange={(e) =>
                set("type", e.target.value as RessourceAdmin["type"])
              }
            >
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Domaine</label>
            <Select
              value={form.domaine}
              onChange={(e) => set("domaine", e.target.value as Domaine)}
            >
              {DOMAINES.map((domaine) => (
                <option key={domaine} value={domaine}>
                  {labelDomaine(domaine)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium" htmlFor="organisme">
              Organisme
            </label>
            <Input
              id="organisme"
              value={form.organisme}
              onChange={(e) => set("organisme", e.target.value)}
              placeholder="Ex. Nations unies (UNOOSA)"
            />
          </div>

          <div className="space-y-2 lg:col-span-4">
            <label className="text-sm font-medium" htmlFor="url">
              URL
            </label>
            <Input
              id="url"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/** Aperçu du rendu public — carte de ressource telle qu'elle apparaîtra dans le listing. */
function RessourcePreview({ form }: { form: FormState }) {
  return (
    <article className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline">{form.type}</Badge>
        <span className="text-muted-foreground text-xs">
          {labelDomaine(form.domaine)}
        </span>
      </div>
      <Heading as="h1" size="lg">
        {form.titre || "Sans titre"}
      </Heading>
      <Paragraph tone="muted">
        {form.description || "Aucune description pour le moment."}
      </Paragraph>
      <p className="text-muted-foreground text-sm">{form.organisme}</p>
    </article>
  );
}
