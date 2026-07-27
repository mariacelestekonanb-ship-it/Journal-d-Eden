"use client";

import * as React from "react";
import { ImagePlus, Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LegalReference } from "@/components/shared/legal-reference";
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";
import type { AdminBlock } from "@/lib/admin/types";
import type { TypeReference } from "@/types";

export interface BlockFieldsProps {
  block: AdminBlock;
  onChange: (block: AdminBlock) => void;
}

const TYPES_REFERENCE: TypeReference[] = [
  "Traité",
  "Loi",
  "Règlement",
  "Convention",
  "Directive",
  "Décision",
  "Jurisprudence",
  "Site officiel",
];

/** Champs d'édition d'un bloc — un cas par variante d'`AdminBlock` (voir `lib/admin/types.ts`). */
export function BlockFields({ block, onChange }: BlockFieldsProps) {
  switch (block.type) {
    case "heading":
      return (
        <Input
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Titre du bloc"
        />
      );

    case "subheading":
      return (
        <Input
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Sous-titre du bloc"
        />
      );

    case "paragraph":
      return (
        <Textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Texte du paragraphe"
        />
      );

    case "quote":
      return (
        <div className="space-y-2">
          <Textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Texte cité"
          />
          <Input
            value={block.source ?? ""}
            onChange={(e) => onChange({ ...block, source: e.target.value })}
            placeholder="Source (optionnel)"
          />
        </div>
      );

    case "callout":
      return (
        <div className="space-y-2">
          <Textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Texte de l'encadré"
          />
          <Select
            value={block.tone ?? "info"}
            onChange={(e) =>
              onChange({
                ...block,
                tone: e.target.value as "info" | "warning",
              })
            }
          >
            <option value="info">Information</option>
            <option value="warning">Avertissement</option>
          </Select>
        </div>
      );

    case "list":
      return <ListFields block={block} onChange={onChange} />;

    case "table":
      return <TableFields block={block} onChange={onChange} />;

    case "image":
      return <ImageFields block={block} onChange={onChange} />;

    case "separator":
      return (
        <p className="text-muted-foreground border-border rounded-lg border border-dashed py-3 text-center text-xs">
          Ligne de séparation — aucun réglage nécessaire.
        </p>
      );

    case "button":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Libellé du bouton"
          />
          <Input
            value={block.href}
            onChange={(e) => onChange({ ...block, href: e.target.value })}
            placeholder="URL de destination"
          />
        </div>
      );

    case "legal-reference":
      return (
        <div className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Select
              value={block.reference.type}
              onChange={(e) =>
                onChange({
                  ...block,
                  reference: {
                    ...block.reference,
                    type: e.target.value as TypeReference,
                  },
                })
              }
            >
              {TYPES_REFERENCE.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Input
              value={block.reference.organisme}
              onChange={(e) =>
                onChange({
                  ...block,
                  reference: { ...block.reference, organisme: e.target.value },
                })
              }
              placeholder="Organisme"
            />
          </div>
          <Input
            value={block.reference.titre}
            onChange={(e) =>
              onChange({
                ...block,
                reference: { ...block.reference, titre: e.target.value },
              })
            }
            placeholder="Titre du texte"
          />
          <Input
            value={block.reference.citation}
            onChange={(e) =>
              onChange({
                ...block,
                reference: { ...block.reference, citation: e.target.value },
              })
            }
            placeholder="Citation précise (article, numéro, année…)"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              type="date"
              value={block.reference.date ?? ""}
              onChange={(e) =>
                onChange({
                  ...block,
                  reference: { ...block.reference, date: e.target.value },
                })
              }
              aria-label="Date du texte"
            />
            <Input
              value={block.reference.url ?? ""}
              onChange={(e) =>
                onChange({
                  ...block,
                  reference: { ...block.reference, url: e.target.value },
                })
              }
              placeholder="URL (optionnel)"
            />
          </div>
          {block.reference.titre ? (
            <div className="pt-1">
              <LegalReference reference={block.reference} />
            </div>
          ) : null}
        </div>
      );

    default:
      return null;
  }
}

function ImageFields({
  block,
  onChange,
}: {
  block: Extract<AdminBlock, { type: "image" }>;
  onChange: (block: AdminBlock) => void;
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="URL de l'image"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => setPickerOpen(true)}
        >
          <ImagePlus aria-hidden />
          Médiathèque
        </Button>
      </div>
      <Input
        value={block.alt}
        onChange={(e) => onChange({ ...block, alt: e.target.value })}
        placeholder="Texte alternatif"
      />
      <Input
        value={block.caption ?? ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder="Légende (optionnel)"
      />

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        allowedTypes={["image", "illustration"]}
        onSelect={(asset) =>
          onChange({
            ...block,
            url: asset.url,
            alt: block.alt || (asset.alt ?? asset.nom),
          })
        }
      />
    </div>
  );
}

function ListFields({
  block,
  onChange,
}: {
  block: Extract<AdminBlock, { type: "list" }>;
  onChange: (block: AdminBlock) => void;
}) {
  function updateItem(index: number, text: string) {
    onChange({
      ...block,
      items: block.items.map((item, i) => (i === index ? text : item)),
    });
  }
  function removeItem(index: number) {
    onChange({ ...block, items: block.items.filter((_, i) => i !== index) });
  }
  function addItem() {
    onChange({ ...block, items: [...block.items, ""] });
  }

  return (
    <div className="space-y-2">
      <label className="text-muted-foreground flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={block.ordered ?? false}
          onChange={(e) => onChange({ ...block, ordered: e.target.checked })}
          className="accent-navy-900 size-4"
        />
        Liste numérotée
      </label>
      {block.items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Élément ${index + 1}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive size-9 shrink-0"
            onClick={() => removeItem(index)}
            aria-label="Supprimer cet élément"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus aria-hidden />
        Ajouter un élément
      </Button>
    </div>
  );
}

function TableFields({
  block,
  onChange,
}: {
  block: Extract<AdminBlock, { type: "table" }>;
  onChange: (block: AdminBlock) => void;
}) {
  function updateHeader(index: number, value: string) {
    onChange({
      ...block,
      headers: block.headers.map((header, i) => (i === index ? value : header)),
    });
  }
  function updateCell(rowIndex: number, colIndex: number, value: string) {
    onChange({
      ...block,
      rows: block.rows.map((row, r) =>
        r === rowIndex
          ? row.map((cell, c) => (c === colIndex ? value : cell))
          : row,
      ),
    });
  }
  function addColumn() {
    onChange({
      ...block,
      headers: [...block.headers, `Colonne ${block.headers.length + 1}`],
      rows: block.rows.map((row) => [...row, ""]),
    });
  }
  function removeColumn(index: number) {
    onChange({
      ...block,
      headers: block.headers.filter((_, i) => i !== index),
      rows: block.rows.map((row) => row.filter((_, i) => i !== index)),
    });
  }
  function addRow() {
    onChange({ ...block, rows: [...block.rows, block.headers.map(() => "")] });
  }
  function removeRow(index: number) {
    onChange({ ...block, rows: block.rows.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-2 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-separate border-spacing-1.5">
        <thead>
          <tr>
            {block.headers.map((header, index) => (
              <th key={index} className="text-left font-normal">
                <div className="flex items-center gap-1">
                  <Input
                    value={header}
                    onChange={(e) => updateHeader(index, e.target.value)}
                    className="h-9 rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive size-8 shrink-0"
                    onClick={() => removeColumn(index)}
                    aria-label="Supprimer cette colonne"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <Input
                    value={cell}
                    onChange={(e) =>
                      updateCell(rowIndex, colIndex, e.target.value)
                    }
                    className="h-9 rounded-lg"
                  />
                </td>
              ))}
              <td>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive size-8"
                  onClick={() => removeRow(rowIndex)}
                  aria-label="Supprimer cette ligne"
                >
                  <X className="size-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addColumn}>
          <Plus aria-hidden />
          Colonne
        </Button>
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus aria-hidden />
          Ligne
        </Button>
      </div>
    </div>
  );
}
