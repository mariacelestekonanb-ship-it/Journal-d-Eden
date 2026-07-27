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
import { Tag } from "@/components/ui/tag";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { ConfirmDialog } from "@/components/admin/content/confirm-dialog";
import { SectionTabs } from "@/components/admin/content/section-tabs";
import { StringListField } from "@/components/admin/content/string-list-field";
import { ValidationSummary } from "@/components/admin/content/validation-summary";
import { AutosaveIndicator } from "@/components/admin/content/autosave-indicator";
import { PreviewDialog } from "@/components/admin/content/preview-dialog";
import { SeoPanel } from "@/components/admin/content/seo-panel";
import { WritingStats } from "@/components/admin/content/writing-stats";
import { BlockEditor } from "@/components/admin/editor/block-editor";
import { RevisionHistory } from "@/components/admin/revisions/revision-history";
import { ContentBlocks } from "@/components/shared/content-blocks";
import { saveTerme } from "@/lib/admin/glossaire-actions";
import { deleteContent } from "@/lib/admin/actions";
import { useAutosave } from "@/hooks/use-autosave";
import { themes } from "@/data/themes";
import {
  ADMIN_STATUSES,
  type AdminStatus,
  type GlossaireTermeAdmin,
  type SeoMeta,
} from "@/lib/admin/types";
import type { ContentBlock } from "@/types";

export interface TermeFormProps {
  terme: GlossaireTermeAdmin | null;
}

const STATUS_LABELS: Record<AdminStatus, string> = {
  brouillon: "Brouillon",
  "en-relecture": "En relecture",
  "a-corriger": "À corriger",
  publie: "Publié",
  archive: "Archivé",
};

interface FormState {
  terme: string;
  definition: string;
  theme: string;
  status: AdminStatus;
  explication: ContentBlock[];
  voirAussi: string[];
  fichesAssociees: string[];
  analysesAssociees: string[];
  seo: SeoMeta;
}

function toFormState(terme: GlossaireTermeAdmin | null): FormState {
  if (terme) {
    return {
      terme: terme.terme,
      definition: terme.definition,
      theme: terme.theme,
      status: terme.status,
      explication: terme.explication ?? [],
      voirAussi: terme.voirAussi ?? [],
      fichesAssociees: terme.contenusAssocies?.fiches ?? [],
      analysesAssociees: terme.contenusAssocies?.analyses ?? [],
      seo: terme.seo ?? {},
    };
  }

  return {
    terme: "",
    definition: "",
    theme: themes[0]?.slug ?? "",
    status: "brouillon",
    explication: [],
    voirAussi: [],
    fichesAssociees: [],
    analysesAssociees: [],
    seo: {},
  };
}

/** Formulaire de création/modification d'un terme du glossaire. */
export function TermeForm({ terme }: TermeFormProps) {
  const router = useRouter();
  const isNew = terme === null;
  const [form, setForm] = React.useState<FormState>(() => toFormState(terme));
  const [tab, setTab] = React.useState<"contenu" | "seo" | "historique">(
    "contenu",
  );
  const [isPending, startTransition] = React.useTransition();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const { lastSavedAt } = useAutosave(`terme-${terme?.id ?? "nouveau"}`, form);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const checks = [
    { label: "Un terme", valid: form.terme.trim().length > 0 },
    { label: "Une définition", valid: form.definition.trim().length > 0 },
  ];
  const isValid = checks.every((check) => check.valid);

  function handleSave(status?: AdminStatus) {
    startTransition(async () => {
      const result = await saveTerme({
        id: terme?.id,
        ...form,
        status: status ?? form.status,
      });
      if (isNew) {
        router.push(`/admin/glossaire/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!terme) return;
    startTransition(async () => {
      await deleteContent("glossaire", terme.id, terme.terme);
      setDeleteOpen(false);
      router.push("/admin/glossaire");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/glossaire"
            className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Glossaire
          </Link>
          <Heading as="h1" size="lg">
            {isNew ? "Nouveau terme" : form.terme || "Sans titre"}
          </Heading>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusBadge status={form.status} />
            {!isNew ? (
              <Paragraph tone="muted" size="sm">
                Mis à jour le {terme.updatedAt} par {terme.updatedBy}
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
          {!isNew && terme.status === "publie" ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/glossaire#${terme.id}`}
                target="_blank"
                rel="noreferrer"
              >
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
            disabled={isPending || form.terme.trim().length === 0}
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
          <TermeContentFields form={form} set={set} />
        ) : tab === "seo" ? (
          <SeoPanel
            value={form.seo}
            onChange={(seo) => set("seo", seo)}
            fallbackTitle={
              form.terme ? `${form.terme} — Glossaire` : "Nouveau terme"
            }
            fallbackDescription={form.definition}
            path="/glossaire"
          />
        ) : terme ? (
          <RevisionHistory versions={terme.versions} />
        ) : null}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer ce terme ?"
        description="Cette action est immédiate dans cette démonstration : aucune base de données réelle n'est connectée, la suppression n'est donc pas persistée durablement."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isPending={isPending}
      />

      <PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <TermePreview form={form} />
      </PreviewDialog>
    </div>
  );
}

interface TermeContentFieldsProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function TermeContentFields({ form, set }: TermeContentFieldsProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Heading as="h2" size="sm">
          Informations générales
        </Heading>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="terme">
            Terme
          </label>
          <Input
            id="terme"
            value={form.terme}
            onChange={(e) => set("terme", e.target.value)}
            placeholder="Ex. Interopérabilité"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="definition">
            Définition
          </label>
          <Textarea
            id="definition"
            value={form.definition}
            onChange={(e) => set("definition", e.target.value)}
            placeholder="Définition claire et concise"
          />
        </div>

        <div className="max-w-xs space-y-2">
          <label className="text-sm font-medium">Thème</label>
          <Select
            value={form.theme}
            onChange={(e) => set("theme", e.target.value)}
          >
            {themes.map((theme) => (
              <option key={theme.slug} value={theme.slug}>
                {theme.titre}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Heading as="h2" size="sm">
            Explication
          </Heading>
          <WritingStats blocks={form.explication} />
        </div>
        <Paragraph tone="muted" size="sm">
          Développement optionnel, affiché sous la définition courte.
        </Paragraph>
        <BlockEditor
          value={form.explication}
          onChange={(blocks) => set("explication", blocks)}
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Voir aussi
        </Heading>
        <StringListField
          values={form.voirAussi}
          onChange={(values) => set("voirAussi", values)}
          placeholder="Un terme lié"
          addLabel="Ajouter un renvoi"
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Fiches associées
        </Heading>
        <StringListField
          values={form.fichesAssociees}
          onChange={(values) => set("fichesAssociees", values)}
          placeholder="Identifiant d'une fiche (ex. qui-possede-l-espace)"
          addLabel="Associer une fiche"
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Analyses associées
        </Heading>
        <StringListField
          values={form.analysesAssociees}
          onChange={(values) => set("analysesAssociees", values)}
          placeholder="Identifiant d'une analyse"
          addLabel="Associer une analyse"
        />
      </section>
    </div>
  );
}

/** Aperçu du rendu public — définition, explication et renvois, tels qu'affichés dans `DefinitionPreview`. */
function TermePreview({ form }: { form: FormState }) {
  return (
    <article className="space-y-5">
      <Heading as="h1" size="lg">
        {form.terme || "Sans titre"}
      </Heading>
      <Paragraph tone="muted">
        {form.definition || "Aucune définition pour le moment."}
      </Paragraph>

      {form.explication.length > 0 ? (
        <ContentBlocks blocks={form.explication} />
      ) : null}

      {form.voirAussi.length > 0 ? (
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Voir aussi
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.voirAussi.map((autreTerme) => (
              <Tag key={autreTerme}>{autreTerme}</Tag>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
