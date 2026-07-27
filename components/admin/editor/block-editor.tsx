"use client";

import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Heading1,
  Heading2,
  Pilcrow,
  List,
  Quote,
  Info,
  AlertTriangle,
  Scale,
  Table,
  Image as ImageIcon,
  Minus,
  MousePointerClick,
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
  /** Restreint la palette « Ajouter un bloc » — utile si un champ doit rester plus étroit qu'`AdminBlock[]` complet. */
  allowedTypes?: AdminBlock["type"][];
}

interface PaletteEntry {
  /** Clé unique de la palette — distincte de `type` pour les deux encadrés, qui partagent le même bloc sous-jacent (`callout`) avec un `tone` différent. */
  key: string;
  type: AdminBlock["type"];
  label: string;
  icon: LucideIcon;
  create: () => AdminBlock;
}

const BLOCK_PALETTE: PaletteEntry[] = [
  {
    key: "heading",
    type: "heading",
    label: "Titre",
    icon: Heading1,
    create: () => ({ type: "heading", text: "" }),
  },
  {
    key: "subheading",
    type: "subheading",
    label: "Sous-titre",
    icon: Heading2,
    create: () => ({ type: "subheading", text: "" }),
  },
  {
    key: "paragraph",
    type: "paragraph",
    label: "Paragraphe",
    icon: Pilcrow,
    create: () => ({ type: "paragraph", text: "" }),
  },
  {
    key: "quote",
    type: "quote",
    label: "Citation",
    icon: Quote,
    create: () => ({ type: "quote", text: "", source: "" }),
  },
  {
    key: "list",
    type: "list",
    label: "Liste",
    icon: List,
    create: () => ({ type: "list", items: [""], ordered: false }),
  },
  {
    key: "table",
    type: "table",
    label: "Tableau",
    icon: Table,
    create: () => ({
      type: "table",
      headers: ["Colonne 1", "Colonne 2"],
      rows: [["", ""]],
    }),
  },
  {
    key: "callout-info",
    type: "callout",
    label: "Encadré d'information",
    icon: Info,
    create: () => ({ type: "callout", text: "", tone: "info" }),
  },
  {
    key: "callout-warning",
    type: "callout",
    label: "Encadré d'avertissement",
    icon: AlertTriangle,
    create: () => ({ type: "callout", text: "", tone: "warning" }),
  },
  {
    key: "legal-reference",
    type: "legal-reference",
    label: "Référence juridique",
    icon: Scale,
    create: () => ({
      type: "legal-reference",
      reference: {
        type: "Loi",
        titre: "",
        citation: "",
        organisme: "",
        date: "",
        url: "",
      },
    }),
  },
  {
    key: "image",
    type: "image",
    label: "Image",
    icon: ImageIcon,
    create: () => ({ type: "image", url: "", alt: "", caption: "" }),
  },
  {
    key: "separator",
    type: "separator",
    label: "Séparateur",
    icon: Minus,
    create: () => ({ type: "separator" }),
  },
  {
    key: "button",
    type: "button",
    label: "Bouton",
    icon: MousePointerClick,
    create: () => ({ type: "button", label: "", href: "" }),
  },
];

/** Icône + libellé d'un bloc déjà présent — distingue les deux tons d'encadré, contrairement à `BLOCK_PALETTE` qui les liste comme deux entrées séparées. */
function blockMeta(block: AdminBlock): { label: string; icon: LucideIcon } {
  if (block.type === "callout") {
    return block.tone === "warning"
      ? { label: "Encadré d'avertissement", icon: AlertTriangle }
      : { label: "Encadré d'information", icon: Info };
  }
  const entry = BLOCK_PALETTE.find((p) => p.type === block.type);
  return entry ?? { label: block.type, icon: Pilcrow };
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

  function addBlock(entry: PaletteEntry) {
    onChange([...value, entry.create()]);
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
            const meta = blockMeta(block);
            return (
              <li key={index} className="border-border rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                    <meta.icon className="size-3.5" aria-hidden />
                    {meta.label}
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
            <DropdownMenuItem key={entry.key} onSelect={() => addBlock(entry)}>
              <entry.icon aria-hidden />
              {entry.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
