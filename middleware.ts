import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

export const config = {
  matcher: ["/admin/:path*"],
};

/**
 * Porte d'entrée unique de l'espace d'administration : tout `/admin/**`
 * (sauf la page de connexion elle-même) exige un cookie de session valide,
 * vérifié ici avant même que la page ne commence à se construire. Voir
 * `lib/admin/session.ts` pour le format du jeton et `lib/admin/login-actions.ts`
 * pour sa création.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);

  if (!authenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
