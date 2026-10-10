import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

export const config = {
  matcher: ["/admin/:path*", "/api/upload"],
};

/**
 * Porte d'entrée unique de l'espace d'administration : tout `/admin/**`
 * (sauf la page de connexion elle-même) et `/api/upload` (consommé depuis
 * l'admin, voir `components/admin/content/media-upload-field.tsx`) exigent
 * un cookie de session valide, vérifié ici avant même que la page ou la
 * route ne commence à s'exécuter. Voir `lib/admin/session.ts` pour le
 * format du jeton et `lib/admin/login-actions.ts` pour sa création.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);

  if (!authenticated) {
    // Une route API attend du JSON, jamais une redirection HTML vers
    // l'écran de connexion — sinon `response.json()` échouerait côté
    // client face à une page de connexion complète.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
