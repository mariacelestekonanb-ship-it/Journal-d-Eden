const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const ADMIN_SESSION_COOKIE = "lexwatch_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Web Crypto (`crypto.subtle`) plutôt que le module `node:crypto` : ce fichier est importé depuis `middleware.ts`, qui tourne sur l'Edge Runtime. */
async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return toHex(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Session admin par mot de passe partagé (`ADMIN_PASSWORD`) : pas de compte
 * ni de base de données, un jeton signé (horodatage d'expiration + HMAC)
 * stocké dans un cookie `httpOnly`. Sans état serveur à conserver, ce jeton
 * reste valide quelle que soit l'instance serverless qui traite la requête
 * suivante — contrairement à une session en mémoire, qui ne survivrait pas
 * au passage d'une instance à l'autre sur Vercel.
 */
export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD n'est pas défini — impossible de créer une session admin.",
    );
  }
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const signature = await sign(String(expiresAt), secret);
  return `${expiresAt}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !token) return false;

  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = await sign(expiresAtRaw, secret);
  return timingSafeEqual(expected, signature);
}
