import { NextResponse, type NextRequest } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

/**
 * Upload de fichier pour l'espace d'administration (logo, média du héros —
 * voir `components/admin/content/media-upload-field.tsx`). Écrit le
 * fichier sur le disque local, sous `public/uploads/`.
 *
 * Deux limites à connaître avant une mise en ligne réelle (voir
 * `SECURITY.md`) :
 * 1. Comme le reste de l'admin, cette route n'a aucune authentification —
 *    n'importe qui atteignant `/api/upload` peut déposer un fichier tant
 *    qu'aucun contrôle d'accès réel n'existe.
 * 2. L'écriture sur disque local ne fonctionne qu'en développement (ou sur
 *    un serveur Node traditionnel) : les plateformes serverless (Vercel,
 *    Netlify) ont un système de fichiers éphémère/en lecture seule en
 *    production — il faudra alors brancher un vrai service de stockage
 *    (S3, Supabase Storage, Cloudinary…) et ne changer que cette route.
 */

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 Mo
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 Mo

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const extension = ALLOWED_EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json(
      {
        error:
          "Format non supporté. Formats acceptés : JPG, PNG, WebP, SVG, MP4, WebM.",
      },
      { status: 415 },
    );
  }

  const isVideo = file.type.startsWith("video/");
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `Fichier trop volumineux (${Math.round(maxSize / (1024 * 1024))} Mo maximum).`,
      },
      { status: 413 },
    );
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  // Nom de fichier régénéré (jamais celui envoyé par le client) : évite
  // toute collision et tout risque de chemin malveillant dans le nom
  // d'origine.
  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    type: isVideo ? "video" : "image",
  });
}
