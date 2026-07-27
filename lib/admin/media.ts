import {
  Image as ImageIcon,
  Shapes,
  FileText,
  File,
  Palette,
  type LucideIcon,
} from "lucide-react";

import type { MediaAsset, MediaType } from "@/lib/admin/types";

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  image: "Images",
  logo: "Logos",
  pdf: "PDF",
  document: "Documents",
  illustration: "Illustrations",
};

export const MEDIA_TYPE_ICONS: Record<MediaType, LucideIcon> = {
  image: ImageIcon,
  logo: Shapes,
  pdf: FileText,
  document: File,
  illustration: Palette,
};

/** Formate une taille en Ko en une chaîne lisible (Ko ou Mo selon l'ordre de grandeur) — partagé par la médiathèque et le sélecteur de média de l'éditeur. */
export function formatTailleMedia(ko: number): string {
  if (ko < 1024) return `${ko} Ko`;
  return `${(ko / 1024).toFixed(1)} Mo`;
}

/**
 * Médiathèque de démonstration. Aucun stockage réel n'est connecté : les
 * URLs sont indicatives (voir le livrable de fin de phase pour brancher un
 * service réel — S3, Supabase Storage, Cloudinary…).
 */
export const mediaAssets: MediaAsset[] = [
  {
    id: "media-1",
    nom: "illustration-orbite-terrestre.svg",
    type: "illustration",
    url: "/media/illustration-orbite-terrestre.svg",
    tailleKo: 84,
    ajouteLe: "2026-07-20",
    alt: "Illustration abstraite d'une orbite terrestre basse",
  },
  {
    id: "media-2",
    nom: "logo-esa.png",
    type: "logo",
    url: "/media/logo-esa.png",
    tailleKo: 42,
    ajouteLe: "2026-07-18",
    alt: "Logo de l'Agence spatiale européenne",
  },
  {
    id: "media-3",
    nom: "logo-cnil.png",
    type: "logo",
    url: "/media/logo-cnil.png",
    tailleKo: 38,
    ajouteLe: "2026-07-14",
    alt: "Logo de la CNIL",
  },
  {
    id: "media-4",
    nom: "reglement-eu-space-act.pdf",
    type: "pdf",
    url: "/media/reglement-eu-space-act.pdf",
    tailleKo: 1240,
    ajouteLe: "2026-07-18",
  },
  {
    id: "media-5",
    nom: "rapport-debris-orbitaux-2026.pdf",
    type: "pdf",
    url: "/media/rapport-debris-orbitaux-2026.pdf",
    tailleKo: 2380,
    ajouteLe: "2026-06-29",
  },
  {
    id: "media-6",
    nom: "photo-satellite-constellation.jpg",
    type: "image",
    url: "/media/photo-satellite-constellation.jpg",
    tailleKo: 512,
    ajouteLe: "2026-06-20",
    alt: "Vue d'artiste d'une constellation de satellites",
  },
  {
    id: "media-7",
    nom: "photo-antenne-radiotelescope.jpg",
    type: "image",
    url: "/media/photo-antenne-radiotelescope.jpg",
    tailleKo: 468,
    ajouteLe: "2026-05-18",
    alt: "Antenne de radiotélescope au sol",
  },
  {
    id: "media-8",
    nom: "guide-conformite-ai-act.docx",
    type: "document",
    url: "/media/guide-conformite-ai-act.docx",
    tailleKo: 156,
    ajouteLe: "2026-07-20",
  },
  {
    id: "media-9",
    nom: "modele-note-de-veille.docx",
    type: "document",
    url: "/media/modele-note-de-veille.docx",
    tailleKo: 64,
    ajouteLe: "2026-04-02",
  },
  {
    id: "media-10",
    nom: "illustration-glossaire-fond.svg",
    type: "illustration",
    url: "/media/illustration-glossaire-fond.svg",
    tailleKo: 71,
    ajouteLe: "2026-03-11",
  },
  {
    id: "media-11",
    nom: "logo-lexwatch-monochrome.svg",
    type: "logo",
    url: "/media/logo-lexwatch-monochrome.svg",
    tailleKo: 12,
    ajouteLe: "2026-01-05",
    alt: "Logo LexWatch, version monochrome",
  },
  {
    id: "media-12",
    nom: "photo-salle-audience-cjue.jpg",
    type: "image",
    url: "/media/photo-salle-audience-cjue.jpg",
    tailleKo: 601,
    ajouteLe: "2026-07-16",
    alt: "Salle d'audience de la Cour de justice de l'Union européenne",
  },
  {
    id: "media-13",
    nom: "texte-integral-nis2.pdf",
    type: "pdf",
    url: "/media/texte-integral-nis2.pdf",
    tailleKo: 890,
    ajouteLe: "2026-07-05",
  },
  {
    id: "media-14",
    nom: "illustration-reseau-satellites.svg",
    type: "illustration",
    url: "/media/illustration-reseau-satellites.svg",
    tailleKo: 93,
    ajouteLe: "2026-06-10",
  },
];
