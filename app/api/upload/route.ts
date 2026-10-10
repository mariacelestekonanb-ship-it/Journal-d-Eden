import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

/**
 * Upload de fichier pour l'espace d'administration (logo, média du héros —
 * voir `components/admin/content/media-upload-field.tsx`).
 *
 * Deux façons d'écrire le fichier, choisies selon l'environnement :
 * - `BLOB_READ_WRITE_TOKEN` défini (Vercel Blob relié au projet) : le
 *   fichier part sur un vrai stockage objet, qui fonctionne en production
 *   sur Vercel. C'est le cas attendu une fois le store Blob créé et relié
 *   (voir README.md) — Vercel injecte alors cette variable automatiquement,
 *   rien à configurer à la main.
 * - Sinon (développement local sans Blob configuré) : écriture sur le
 *   disque local, sous `public/uploads/`. Ce repli ne fonctionnerait pas
 *   seul en production : les plateformes serverless (Vercel, Netlify) ont
 *   un système de fichiers éphémère/en lecture seule à l'exécution.
 *
 * Point de sécurité à connaître dans les deux cas (voir `SECURITY.md`) :
 * comme le reste de l'admin, cette route est protégée par la même session
 * que `/admin` (voir `middleware.ts`), mais reste un upload non borné à un
 * utilisateur précis — un seul mot de passe partagé, pas des comptes
 * individuels.
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

  // Nom de fichier régénéré (jamais celui envoyé par le client) : évite
  // toute collision et tout risque de chemin malveillant dans le nom
  // d'origine.
  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const mediaType = isVideo ? "video" : "image";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url, type: mediaType });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    type: mediaType,
  });
}
