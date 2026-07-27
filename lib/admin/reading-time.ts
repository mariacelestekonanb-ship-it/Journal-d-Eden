import type { ContentBlock } from "@/types";

const WORDS_PER_MINUTE = 200;

/** Texte « lisible » porté par un bloc — vide pour les blocs purement structurels (séparateur). */
function blockText(block: ContentBlock): string {
  switch (block.type) {
    case "heading":
    case "subheading":
    case "paragraph":
    case "quote":
    case "callout":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "table":
      return [...block.headers, ...block.rows.flat()].join(" ");
    case "legal-reference":
      return `${block.reference.titre} ${block.reference.citation}`;
    case "button":
      return block.label;
    case "image":
      return block.caption ?? "";
    case "separator":
      return "";
  }
}

/** Nombre de mots du corps de texte — toutes langues confondues, simple découpage sur les espaces. */
export function countWords(blocks: ContentBlock[]): number {
  const text = blocks.map(blockText).join(" ").trim();
  if (text.length === 0) return 0;
  return text.split(/\s+/).length;
}

/** Temps de lecture estimé en minutes, à partir d'une vitesse de lecture moyenne (~200 mots/minute). Toujours au moins 1 minute dès qu'il y a du texte. */
export function estimateReadingTime(blocks: ContentBlock[]): number {
  const words = countWords(blocks);
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Extrait généré automatiquement à partir du premier bloc de texte courant
 * (paragraphe ou citation) — sert de point de départ pour « Réponse
 * courte » / « Résumé » / « Définition », que l'autrice reste toujours
 * libre de retoucher ensuite.
 */
export function generateExcerpt(
  blocks: ContentBlock[],
  maxLength = 200,
): string {
  const source = blocks.find(
    (block): block is Extract<ContentBlock, { type: "paragraph" | "quote" }> =>
      block.type === "paragraph" || block.type === "quote",
  );
  const text = source?.text.trim() ?? "";
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  return `${truncated.replace(/\s+\S*$/, "")}…`;
}
