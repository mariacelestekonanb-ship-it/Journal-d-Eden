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
import { ChronologyField } from "@/components/admin/content/chronology-field";
import { ImpactField } from "@/components/admin/content/impact-field";
import { OfficialReferencesField } from "@/components/admin/content/official-references-field";
import { BlockEditor } from "@/components/admin/editor/block-editor";
import { RevisionHistory } from "@/components/admin/revisions/revision-history";
import { saveAnalyse } from "@/lib/admin/veille-actions";
import { deleteContent } from "@/lib/admin/actions";
import { slugifyTerme, labelDomaine } from "@/lib/format";
import {
  ADMIN_STATUSES,
  type AdminStatus,
  type AnalyseAdmin,
  type CategorieAdmin,
} from "@/lib/admin/types";
import type { AdminBlock } from "@/lib/admin/types";
import type {
  ContentBlock,
  Domaine,
  EvenementChronologie,
  ImpactAnalyse,
  ReferenceJuridique,
  ReferenceOfficielle,
  TypeVeille,
} from "@/types";

export interface AnalyseFormProps {
  analyse: AnalyseAdmin | null;
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
const TYPES_VEILLE: TypeVeille[] = [
  "Décision",
  "Loi",
  "Règlement",
  "Convention",
  "Jurisprudence",
  "Institution",
];

const ANALYSE_BLOCK_TYPES: AdminBlock["type"][] = [
  "heading",
  "paragraph",
  "callout",
  "list",
  "quote",
];

interface FormState {
  slug: string;
  titre: string;
  resume: string;
  domaine: Domaine;
  categorie: string;
  type: TypeVeille;
  source: string;
  date: string;
  dateMiseAJour: string;
  tempsLecture: number;
  aLaUne: boolean;
  status: AdminStatus;
  pointsCles: string[];
  chronologie: EvenementChronologie[];
  contexteJuridique: ReferenceJuridique[];
  analyse: ContentBlock[];
  impact: ImpactAnalyse;
  referencesOfficielles: ReferenceOfficielle[];
}

function toFormState(
  analyse: AnalyseAdmin | null,
  categories: CategorieAdmin[],
): FormState {
  if (analyse) {
    return {
      slug: analyse.slug,
      titre: analyse.titre,
      resume: analyse.resume,
      domaine: analyse.domaine,
      categorie: analyse.categorie,
      type: analyse.type,
      source: analyse.source,
      date: analyse.date,
      dateMiseAJour: analyse.dateMiseAJour,
      tempsLecture: analyse.tempsLecture,
      aLaUne: analyse.aLaUne ?? false,
      status: analyse.status,
      pointsCles: analyse.pointsCles,
      chronologie: analyse.chronologie,
      contexteJuridique: analyse.contexteJuridique,
      analyse: analyse.analyse,
      impact: analyse.impact,
      referencesOfficielles: analyse.referencesOfficielles,
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  return {
    slug: "",
    titre: "",
    resume: "",
    domaine: "droit-spatial",
    categorie:
      categories.find((c) => c.domaine === "droit-spatial")?.slug ?? "",
    type: "Décision",
    source: "",
    date: today,
    dateMiseAJour: today,
    tempsLecture: 5,
    aLaUne: false,
    status: "brouillon",
    pointsCles: [""],
    chronologie: [],
    contexteJuridique: [],
    analyse: [],
    impact: {},
    referencesOfficielles: [],
  };
}

/** Formulaire de création/modification d'une analyse — reprend la structure de `FicheForm` (voir `app/admin/fiches/[id]/fiche-form.tsx`). */
export function AnalyseForm({ analyse, categories }: AnalyseFormProps) {
  const router = useRouter();
  const isNew = analyse === null;
  const [form, setForm] = React.useState<FormState>(() =>
    toFormState(analyse, categories),
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
    set("slug", slugifyTerme(form.titre));
  }

  function handleSave(status?: AdminStatus) {
    startTransition(async () => {
      const result = await saveAnalyse({
        id: analyse?.id,
        ...form,
        slug: form.slug || slugifyTerme(form.titre),
        status: status ?? form.status,
      });
      if (isNew) {
        router.push(`/admin/veille/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!analyse) return;
    startTransition(async () => {
      await deleteContent("analyse", analyse.id, analyse.titre);
      setDeleteOpen(false);
      router.push("/admin/veille");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/veille"
            className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Veille juridique
          </Link>
          <Heading as="h1" size="lg">
            {isNew ? "Nouvelle analyse" : form.titre || "Sans titre"}
          </Heading>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={form.status} />
            {!isNew ? (
              <Paragraph tone="muted" size="sm">
                Mis à jour le {analyse.updatedAt} par {analyse.updatedBy}
              </Paragraph>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!isNew && analyse.status === "publie" ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/veille-juridique/${analyse.slug}`}
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
            disabled={isPending || form.titre.trim().length === 0}
            onClick={() => handleSave()}
          >
            Enregistrer
          </Button>
          {form.status !== "publie" ? (
            <Button
              variant="accent"
              size="sm"
              disabled={isPending || form.titre.trim().length === 0}
              onClick={() => handleSave("publie")}
            >
              Publier
            </Button>
          ) : null}
        </div>
      </div>

      {isNew ? (
        <AnalyseContentFields
          form={form}
          set={set}
          categories={categories}
          categoriesDuDomaine={categoriesDuDomaine}
          onGenerateSlug={handleGenerateSlug}
          isNew
        />
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
            <AnalyseContentFields
              form={form}
              set={set}
              categories={categories}
              categoriesDuDomaine={categoriesDuDomaine}
              onGenerateSlug={handleGenerateSlug}
              isNew={false}
            />
          ) : (
            <RevisionHistory versions={analyse.versions} />
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette analyse ?"
        description="Cette action est immédiate dans cette démonstration : aucune base de données réelle n'est connectée, la suppression n'est donc pas persistée durablement."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </div>
  );
}

interface AnalyseContentFieldsProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  categories: CategorieAdmin[];
  categoriesDuDomaine: CategorieAdmin[];
  onGenerateSlug: () => void;
  isNew: boolean;
}

function AnalyseContentFields({
  form,
  set,
  categories,
  categoriesDuDomaine,
  onGenerateSlug,
  isNew,
}: AnalyseContentFieldsProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Heading as="h2" size="sm">
          Informations générales
        </Heading>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="titre">
            Titre
          </label>
          <Input
            id="titre"
            value={form.titre}
            onChange={(e) => set("titre", e.target.value)}
            placeholder="Ex. L'EDPB adopte des lignes directrices sur…"
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
              placeholder="genere-depuis-le-titre"
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
          <label className="text-sm font-medium" htmlFor="resume">
            Résumé
          </label>
          <Textarea
            id="resume"
            value={form.resume}
            onChange={(e) => set("resume", e.target.value)}
            placeholder="Résumé en une ou deux phrases"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <label className="text-sm font-medium">Type</label>
            <Select
              value={form.type}
              onChange={(e) => set("type", e.target.value as TypeVeille)}
            >
              {TYPES_VEILLE.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="source">
              Source
            </label>
            <Input
              id="source"
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
              placeholder="Ex. Commission européenne"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="date">
              Date de publication
            </label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
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

          <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.aLaUne}
              onChange={(e) => set("aLaUne", e.target.checked)}
              className="accent-navy-900 size-4"
            />
            À la une
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          À retenir en 1 minute
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
          Les faits
        </Heading>
        <ChronologyField
          values={form.chronologie}
          onChange={(values) => set("chronologie", values)}
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Le contexte juridique
        </Heading>
        <ReferencesField
          values={form.contexteJuridique}
          onChange={(values) => set("contexteJuridique", values)}
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Notre analyse
        </Heading>
        <BlockEditor
          value={form.analyse}
          onChange={(blocks) => set("analyse", blocks as ContentBlock[])}
          allowedTypes={ANALYSE_BLOCK_TYPES}
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Pourquoi cette décision est importante
        </Heading>
        <ImpactField
          value={form.impact}
          onChange={(value) => set("impact", value)}
        />
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="sm">
          Références officielles
        </Heading>
        <OfficialReferencesField
          values={form.referencesOfficielles}
          onChange={(values) => set("referencesOfficielles", values)}
        />
      </section>
    </div>
  );
}
