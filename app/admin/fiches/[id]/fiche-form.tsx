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
import { BlockEditor } from "@/components/admin/editor/block-editor";
import { RevisionHistory } from "@/components/admin/revisions/revision-history";
import { saveFiche } from "@/lib/admin/fiches-actions";
import { deleteContent } from "@/lib/admin/actions";
import { slugifyTerme, labelDomaine } from "@/lib/format";
import {
  ADMIN_STATUSES,
  type AdminStatus,
  type CategorieAdmin,
  type FicheAdmin,
} from "@/lib/admin/types";
import type { AdminBlock } from "@/lib/admin/types";
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

const EXPLICATION_BLOCK_TYPES: AdminBlock["type"][] = [
  "heading",
  "paragraph",
  "callout",
  "list",
  "quote",
];

interface FormState {
  slug: string;
  question: string;
  reponseCourte: string;
  domaine: Domaine;
  categorie: string;
  niveau: Niveau;
  tempsLecture: number;
  dateMiseAJour: string;
  status: AdminStatus;
  contexte: string[];
  pointsCles: string[];
  references: ReferenceJuridique[];
  explication: ContentBlock[];
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
      tempsLecture: fiche.tempsLecture,
      dateMiseAJour: fiche.dateMiseAJour,
      status: fiche.status,
      contexte: fiche.contexte,
      pointsCles: fiche.pointsCles,
      references: fiche.references,
      explication: fiche.explication,
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
    tempsLecture: 5,
    dateMiseAJour: new Date().toISOString().slice(0, 10),
    status: "brouillon",
    contexte: [""],
    pointsCles: [""],
    references: [],
    explication: [],
  };
}

/**
 * Formulaire de création/modification d'une fiche — implémentation de
 * référence : les modules veille, glossaire et ressources reprennent la
 * même structure (en-tête statut/actions, onglets Contenu/Historique,
 * champs composés à partir des mêmes petits composants réutilisables).
 */
export function FicheForm({ fiche, categories }: FicheFormProps) {
  const router = useRouter();
  const isNew = fiche === null;
  const [form, setForm] = React.useState<FormState>(() =>
    toFormState(fiche, categories),
  );
  const [tab, setTab] = React.useState<"contenu" | "historique">("contenu");
  const [isPending, startTransition] = React.useTransition();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const categoriesDuDomaine = categories.filter(
    (c) => c.domaine === form.domaine,
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleGenerateSlug() {
    set("slug", slugifyTerme(form.question));
  }

  function handleSave(status?: AdminStatus) {
    startTransition(async () => {
      const result = await saveFiche({
        id: fiche?.id,
        ...form,
        slug: form.slug || slugifyTerme(form.question),
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
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={form.status} />
            {!isNew ? (
              <Paragraph tone="muted" size="sm">
                Mis à jour le {fiche.updatedAt} par {fiche.updatedBy}
              </Paragraph>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!isNew && fiche.status === "publie" ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/comprendre/${fiche.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <Eye aria-hidden />
                Prévisualiser
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
              disabled={isPending || form.question.trim().length === 0}
              onClick={() => handleSave("publie")}
            >
              Publier
            </Button>
          ) : null}
        </div>
      </div>

      {isNew ? (
        <div className="space-y-6">
          <FicheContentFields
            form={form}
            set={set}
            categories={categories}
            categoriesDuDomaine={categoriesDuDomaine}
            onGenerateSlug={handleGenerateSlug}
            isNew
          />
        </div>
      ) : (
        <div className="space-y-6">
          <SectionTabs
            tabs={[
              { id: "contenu", label: "Contenu" },
              { id: "historique", label: "Historique" },
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
              isNew={false}
            />
          ) : (
            <RevisionHistory versions={fiche.versions} />
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette fiche ?"
        description="Cette action est immédiate dans cette démonstration : aucune base de données réelle n'est connectée, la suppression n'est donc pas persistée durablement."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </div>
  );
}

interface FicheContentFieldsProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  categories: CategorieAdmin[];
  categoriesDuDomaine: CategorieAdmin[];
  onGenerateSlug: () => void;
  isNew: boolean;
}

function FicheContentFields({
  form,
  set,
  categories,
  categoriesDuDomaine,
  onGenerateSlug,
  isNew,
}: FicheContentFieldsProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Heading as="h2" size="sm">
          Informations générales
        </Heading>
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
          <label className="text-sm font-medium" htmlFor="reponseCourte">
            Réponse courte
          </label>
          <Textarea
            id="reponseCourte"
            value={form.reponseCourte}
            onChange={(e) => set("reponseCourte", e.target.value)}
            placeholder="Résumé en une ou deux phrases"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Domaine</label>
            <Select
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
            <label className="text-sm font-medium">Catégorie</label>
            <Select
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
            <label className="text-sm font-medium">Niveau</label>
            <Select
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
            <label className="text-sm font-medium" htmlFor="tempsLecture">
              Temps de lecture (min)
            </label>
            <Input
              id="tempsLecture"
              type="number"
              min={1}
              value={form.tempsLecture}
              onChange={(e) => set("tempsLecture", Number(e.target.value))}
            />
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
        <Heading as="h2" size="sm">
          Notre explication
        </Heading>
        <BlockEditor
          value={form.explication}
          onChange={(blocks) => set("explication", blocks as ContentBlock[])}
          allowedTypes={EXPLICATION_BLOCK_TYPES}
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
