"use client";

import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Heading1,
  Pilcrow,
  List,
  Quote,
  MessageSquareWarning,
  Scale,
  Table,
  Link2,
  Image as ImageIcon,
  Code,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlockFields } from "@/components/admin/editor/block-fields";
import type { AdminBlock } from "@/lib/admin/types";

export interface BlockEditorProps {
  value: AdminBlock[];
  onChange: (blocks: AdminBlock[]) => void;
  /** Restreint la palette « Ajouter un bloc » — utilisé quand le champ édité est typé plus étroitement que `AdminBlock[]` (ex. `ContentBlock[]` côté public). */
  allowedTypes?: AdminBlock["type"][];
}

const BLOCK_PALETTE: Array<{
  type: AdminBlock["type"];
  label: string;
  icon: LucideIcon;
}> = [
  { type: "heading", label: "Titre", icon: Heading1 },
  { type: "paragraph", label: "Paragraphe", icon: Pilcrow },
  { type: "list", label: "Liste", icon: List },
  { type: "quote", label: "Citation", icon: Quote },
  { type: "callout", label: "Encadré", icon: MessageSquareWarning },
  { type: "legal-reference", label: "Référence juridique", icon: Scale },
  { type: "table", label: "Tableau", icon: Table },
  { type: "link", label: "Lien", icon: Link2 },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "code", label: "Code", icon: Code },
];

function blocVide(type: AdminBlock["type"]): AdminBlock {
  switch (type) {
    case "heading":
      return { type: "heading", text: "" };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "list":
      return { type: "list", items: [""], ordered: false };
    case "quote":
      return { type: "quote", text: "", source: "" };
    case "callout":
      return { type: "callout", text: "", tone: "info" };
    case "table":
      return {
        type: "table",
        headers: ["Colonne 1", "Colonne 2"],
        rows: [["", ""]],
      };
    case "code":
      return { type: "code", language: "", code: "" };
    case "image":
      return { type: "image", url: "", alt: "", caption: "" };
    case "legal-reference":
      return {
        type: "legal-reference",
        reference: {
          type: "Loi",
          titre: "",
          citation: "",
          organisme: "",
          url: "",
        },
      };
    case "link":
      return { type: "link", label: "", href: "" };
  }
}

/**
 * Éditeur de contenu par blocs : chaque bloc est une variante d'`AdminBlock`
 * (voir `lib/admin/types.ts`), directement compatible avec `ContentBlock`
 * côté public — le contenu reste donc un simple tableau sérialisable
 * (`JSON.stringify(blocks)`), prêt à être stocké tel quel par n'importe quel
 * backend (Prisma en JSON, Sanity/Payload en champ « rich content »…).
 * Le réordonnancement se fait par boutons haut/bas plutôt que par
 * glisser-déposer, pour rester utilisable au clavier sans dépendance
 * supplémentaire.
 */
export function BlockEditor({
  value,
  onChange,
  allowedTypes,
}: BlockEditorProps) {
  const availableBlocks = allowedTypes
    ? BLOCK_PALETTE.filter((entry) => allowedTypes.includes(entry.type))
    : BLOCK_PALETTE;

  function addBlock(type: AdminBlock["type"]) {
    onChange([...value, blocVide(type)]);
  }
  function updateBlock(index: number, block: AdminBlock) {
    onChange(value.map((b, i) => (i === index ? block : b)));
  }
  function removeBlock(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }
  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <EmptyState
          title="Contenu vide"
          description="Ajoutez un premier bloc pour commencer à rédiger."
        />
      ) : (
        <ol className="space-y-3">
          {value.map((block, index) => {
            const palette = BLOCK_PALETTE.find((p) => p.type === block.type);
            return (
              <li key={index} className="border-border rounded-2xl border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                    {palette ? (
                      <palette.icon className="size-3.5" aria-hidden />
                    ) : null}
                    {palette?.label ?? block.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={index === 0}
                      onClick={() => moveBlock(index, -1)}
                      aria-label="Déplacer ce bloc vers le haut"
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={index === value.length - 1}
                      onClick={() => moveBlock(index, 1)}
                      aria-label="Déplacer ce bloc vers le bas"
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive size-8"
                      onClick={() => removeBlock(index)}
                      aria-label="Supprimer ce bloc"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <BlockFields
                  block={block}
                  onChange={(next) => updateBlock(index, next)}
                />
              </li>
            );
          })}
        </ol>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus aria-hidden />
            Ajouter un bloc
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {availableBlocks.map((entry) => (
            <DropdownMenuItem
              key={entry.type}
              onSelect={() => addBlock(entry.type)}
            >
              <entry.icon aria-hidden />
              {entry.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
