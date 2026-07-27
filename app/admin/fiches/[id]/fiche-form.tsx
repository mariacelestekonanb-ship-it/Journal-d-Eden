"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Sparkles, Trash2 } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { ConfirmDialog } from "@/components/admin/content/confirm-dialog";
import { SectionTabs } from "@/components/admin/content/section-tabs";
import { StringListField } from "@/components/admin/content/string-list-field";
import { ReferencesField } from "@/components/admin/content/references-field";
import { CoverImageField } from "@/components/admin/content/cover-image-field";
import { WritingStats } from "@/components/admin/content/writing-stats";
import { ValidationSummary } from "@/components/admin/content/validation-summary";
import { AutosaveIndicator } from "@/components/admin/content/autosave-indicator";
import { PreviewDialog } from "@/components/admin/content/preview-dialog";
import { SeoPanel } from "@/components/admin/content/seo-panel";
import { BlockEditor } from "@/components/admin/editor/block-editor";
import { RevisionHistory } from "@/components/admin/revisions/revision-history";
import { ContentBlocks } from "@/components/shared/content-blocks";
import { LegalReference } from "@/components/shared/legal-reference";
import { saveFiche } from "@/lib/admin/fiches-actions";
import { deleteContent } from "@/lib/admin/actions";
import { slugifyTerme, labelDomaine, formatDate } from "@/lib/format";
import { estimateReadingTime, generateExcerpt } from "@/lib/admin/reading-time";
import { useAutosave } from "@/hooks/use-autosave";
import {
  ADMIN_STATUSES,
  type AdminStatus,
  type CategorieAdmin,
  type Couverture,
  type FicheAdmin,
  type SeoMeta,
} from "@/lib/admin/types";
import type {
  ContentBlock,
  Domaine,
  Niveau,
  ReferenceJuridique,
} from "@/types";

export interface FicheFormProps {
  fiche: FicheAdmin | null;
  categories: CategorieAdmin[];
}

const STATUS_LABELS: Record<AdminStatus, string> = {
  brouillon: "Brouillon",
  "en-relecture": "En relecture",
  "a-corriger": "À corriger",
  publie: "Publié",
  archive: "Archivé",
};

const DOMAINES: Domaine[] = ["droit-spatial", "droit-numerique"];
const NIVEAUX: Niveau[] = ["Débutant", "Intermédiaire", "Avancé"];

interface FormState {
  slug: string;
  question: string;
  reponseCourte: string;
  domaine: Domaine;
  categorie: string;
  niveau: Niveau;
  dateMiseAJour: string;
  status: AdminStatus;
  contexte: string[];
  pointsCles: string[];
  references: ReferenceJuridique[];
  explication: ContentBlock[];
  couverture: Couverture | undefined;
  seo: SeoMeta;
}

function toFormState(
  fiche: FicheAdmin | null,
  categories: CategorieAdmin[],
): FormState {
  if (fiche) {
    return {
      slug: fiche.slug,
      question: fiche.question,
      reponseCourte: fiche.reponseCourte,
      domaine: fiche.domaine,
      categorie: fiche.categorie,
      niveau: fiche.niveau,
      dateMiseAJour: fiche.dateMiseAJour,
      status: fiche.status,
      contexte: fiche.contexte,
      pointsCles: fiche.pointsCles,
      references: fiche.references,
      explication: fiche.explication,
      couverture: fiche.couverture,
      seo: fiche.seo ?? {},
    };
  }

  return {
    slug: "",
    question: "",
    reponseCourte: "",
    domaine: "droit-spatial",
    categorie:
      categories.find((c) => c.domaine === "droit-spatial")?.slug ?? "",
    niveau: "Débutant",
    dateMiseAJour: new Date().toISOString().slice(0, 10),
    status: "brouillon",
    contexte: [""],
    pointsCles: [""],
    references: [],
    explication: [],
    couverture: undefined,
    seo: {},
  };
}

/**
 * Formulaire de création/modification d'une fiche — implémentation de
 * référence : les modules veille, glossaire et ressources reprennent la
 * même structure (en-tête statut/actions, onglets Contenu/SEO/Historique,
 * champs composés à partir des mêmes petits composants réutilisables).
 */
export function FicheForm({ fiche, categories }: FicheFormProps) {
  const router = useRouter();
  const isNew = fiche === null;
  const [form, setForm] = React.useState<FormState>(() =>
    toFormState(fiche, categories),
  );
  const [tab, setTab] = React.useState<"contenu" | "seo" | "historique">(
    "contenu",
  );
  const [isPending, startTransition] = React.useTransition();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const { lastSavedAt } = useAutosave(`fiche-${fiche?.id ?? "nouveau"}`, form);

  const categoriesDuDomaine = categories.filter(
    (c) => c.domaine === form.domaine,
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleGenerateSlug() {
    set("slug", slugifyTerme(form.question));
  }

  function handleGenerateExcerpt() {
    set("reponseCourte", generateExcerpt(form.explication));
  }

  const checks = [
    { label: "Une question", valid: form.question.trim().length > 0 },
    {
      label: "Une réponse courte",
      valid: form.reponseCourte.trim().length > 0,
    },
    { label: "Une catégorie", valid: form.categorie.trim().length > 0 },
    {
      label: "Un contenu dans « Notre explication »",
      valid: form.explication.length > 0,
    },
  ];
  const isValid = checks.every((check) => check.valid);

  function handleSave(status?: AdminStatus) {
    startTransition(async () => {
      const result = await saveFiche({
        id: fiche?.id,
        ...form,
        slug: form.slug || slugifyTerme(form.question),
        tempsLecture: estimateReadingTime(form.explication) || 1,
        status: status ?? form.status,
      });
      if (isNew) {
        router.push(`/admin/fiches/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!fiche) return;
    startTransition(async () => {
      await deleteContent("fiche", fiche.id, fiche.question);
      setDeleteOpen(false);
      router.push("/admin/fiches");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/fiches"
            className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Fiches
          </Link>
          <Heading as="h1" size="lg">
            {isNew ? "Nouvelle fiche" : form.question || "Sans titre"}
          </Heading>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusBadge status={form.status} />
            {!isNew ? (
              <Paragraph tone="muted" size="sm">
                Mis à jour le {fiche.updatedAt} par {fiche.updatedBy}
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
          {!isNew && fiche.status === "publie" ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/comprendre/${fiche.slug}`}
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
            disabled={isPending || form.question.trim().length === 0}
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
          <FicheContentFields
            form={form}
            set={set}
            categories={categories}
            categoriesDuDomaine={categoriesDuDomaine}
            onGenerateSlug={handleGenerateSlug}
            onGenerateExcerpt={handleGenerateExcerpt}
            isNew={isNew}
          />
        ) : tab === "seo" ? (
          <SeoPanel
            value={form.seo}
            onChange={(seo) => set("seo", seo)}
            fallbackTitle={form.question || "Nouvelle fiche"}
            fallbackDescription={form.reponseCourte}
            path={`/comprendre/${form.slug || "nouvelle-fiche"}`}
          />
        ) : fiche ? (
          <RevisionHistory versions={fiche.versions} />
        ) : null}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette fiche ?"
        description="Cette action est immédiate dans cette démonstration : aucune base de données réelle n'est connectée, la suppression n'est donc pas persistée durablement."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isPending={isPending}
      />

      <PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <FichePreview form={form} />
      </PreviewDialog>
    </div>
  );
}

interface FicheContentFieldsProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  categories: CategorieAdmin[];
  categoriesDuDomaine: CategorieAdmin[];
  onGenerateSlug: () => void;
  onGenerateExcerpt: () => void;
  isNew: boolean;
}

function FicheContentFields({
  form,
  set,
  categories,
  categoriesDuDomaine,
  onGenerateSlug,
  onGenerateExcerpt,
  isNew,
}: FicheContentFieldsProps) {
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
          <label className="text-sm font-medium" htmlFor="question">
            Question
          </label>
          <Input
            id="question"
            value={form.question}
            onChange={(e) => set("question", e.target.value)}
            placeholder="Ex. Qui possède l'espace ?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="slug">
            Identifiant (URL publique)
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="genere-depuis-la-question"
              disabled={!isNew}
            />
            {isNew ? (
              <Button variant="outline" size="sm" onClick={onGenerateSlug}>
                <Sparkles aria-hidden />
                Générer
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="reponseCourte">
              Réponse courte
            </label>
            <Button variant="ghost" size="sm" onClick={onGenerateExcerpt}>
              <Sparkles aria-hidden />
              Générer depuis l&apos;explication
            </Button>
          </div>
          <Textarea
            id="reponseCourte"
            value={form.reponseCourte}
            onChange={(e) => set("reponseCourte", e.target.value)}
            placeholder="Résumé en une ou deux phrases"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="domaine">
              Domaine
            </label>
            <Select
              id="domaine"
              value={form.domaine}
              onChange={(e) => {
                const domaine = e.target.value as Domaine;
                set("domaine", domaine);
                const premiereCategorie = categories.find(
                  (c) => c.domaine === domaine,
                );
                set("categorie", premiereCategorie?.slug ?? "");
              }}
            >
              {DOMAINES.map((domaine) => (
                <option key={domaine} value={domaine}>
                  {labelDomaine(domaine)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="categorie">
              Catégorie
            </label>
            <Select
              id="categorie"
              value={form.categorie}
              onChange={(e) => set("categorie", e.target.value)}
            >
              {categoriesDuDomaine.map((categorie) => (
                <option key={categorie.slug} value={categorie.slug}>
                  {categorie.titre}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="niveau">
              Niveau
            </label>
            <Select
              id="niveau"
              value={form.niveau}
              onChange={(e) => set("niveau", e.target.value as Niveau)}
            >
              {NIVEAUX.map((niveau) => (
                <option key={niveau} value={niveau}>
                  {niveau}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="dateMiseAJour">
              Date de mise à jour
            </label>
            <Input
              id="dateMiseAJour"
              type="date"
              value={form.dateMiseAJour}
              onChange={(e) => set("dateMiseAJour", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Pourquoi cette question se pose
        </Heading>
        <StringListField
          values={form.contexte}
          onChange={(values) => set("contexte", values)}
          placeholder="Un paragraphe de contexte"
          addLabel="Ajouter un paragraphe"
          multiline
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Heading as="h2" size="sm">
            Notre explication
          </Heading>
          <WritingStats blocks={form.explication} />
        </div>
        <BlockEditor
          value={form.explication}
          onChange={(blocks) => set("explication", blocks)}
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          À retenir
        </Heading>
        <StringListField
          values={form.pointsCles}
          onChange={(values) => set("pointsCles", values)}
          placeholder="Un point clé"
          addLabel="Ajouter un point"
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Ce que dit le droit
        </Heading>
        <ReferencesField
          values={form.references}
          onChange={(values) => set("references", values)}
        />
      </section>
    </div>
  );
}

/** Aperçu du rendu public, composé des mêmes briques que le site (`ContentBlocks`, `LegalReference`) — pas une image statique. */
function FichePreview({ form }: { form: FormState }) {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {labelDomaine(form.domaine)} · {form.niveau}
        </p>
        <Heading as="h1" size="lg" className="mt-2">
          {form.question || "Sans titre"}
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-3">
          {form.reponseCourte || "Aucune réponse courte pour le moment."}
        </Paragraph>
        <p className="text-muted-foreground mt-3 text-xs">
          Mis à jour le {formatDate(form.dateMiseAJour)}
        </p>
      </div>

      {form.contexte.length > 0 ? (
        <div className="space-y-3">
          <Heading as="h2" size="sm">
            Pourquoi cette question se pose
          </Heading>
          {form.contexte.map((paragraphe, index) => (
            <Paragraph key={index} tone="muted">
              {paragraphe}
            </Paragraph>
          ))}
        </div>
      ) : null}

      {form.explication.length > 0 ? (
        <div>
          <Heading as="h2" size="sm" className="mb-4">
            Notre explication
          </Heading>
          <ContentBlocks blocks={form.explication} />
        </div>
      ) : null}

      {form.pointsCles.length > 0 ? (
        <div className="bg-muted/60 rounded-xl p-5">
          <Heading as="h2" size="sm">
            À retenir
          </Heading>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
            {form.pointsCles.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {form.references.length > 0 ? (
        <div className="space-y-3">
          <Heading as="h2" size="sm">
            Ce que dit le droit
          </Heading>
          {form.references.map((reference, index) => (
            <LegalReference key={index} reference={reference} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
