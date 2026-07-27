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
import { StatusBadge } from "@/components/admin/content/status-badge";
import { ConfirmDialog } from "@/components/admin/content/confirm-dialog";
import { SectionTabs } from "@/components/admin/content/section-tabs";
import { RevisionHistory } from "@/components/admin/revisions/revision-history";
import { saveRessource } from "@/lib/admin/ressources-actions";
import { deleteContent } from "@/lib/admin/actions";
import { labelDomaine } from "@/lib/format";
import {
  ADMIN_STATUSES,
  type AdminStatus,
  type RessourceAdmin,
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
  };
}

/** Formulaire de création/modification d'une ressource. */
export function RessourceForm({ ressource }: RessourceFormProps) {
  const router = useRouter();
  const isNew = ressource === null;
  const [form, setForm] = React.useState<FormState>(() =>
    toFormState(ressource),
  );
  const [tab, setTab] = React.useState<"contenu" | "historique">("contenu");
  const [isPending, startTransition] = React.useTransition();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

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
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={form.status} />
            {!isNew ? (
              <Paragraph tone="muted" size="sm">
                Mis à jour le {ressource.updatedAt} par {ressource.updatedBy}
              </Paragraph>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!isNew && ressource.status === "publie" ? (
            <Button variant="outline" size="sm" asChild>
              <a href="/ressources" target="_blank" rel="noreferrer">
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
        <RessourceContentFields form={form} set={set} />
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
            <RessourceContentFields form={form} set={set} />
          ) : (
            <RevisionHistory versions={ressource.versions} />
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette ressource ?"
        description="Cette action est immédiate dans cette démonstration : aucune base de données réelle n'est connectée, la suppression n'est donc pas persistée durablement."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isPending={isPending}
      />
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
