import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getRequiredRoles } from "@/shared/constants/route-permissions";
import type { Role } from "@/shared/constants/roles";

const PUBLIC_PATHS = ["/connexion", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe", "/auth/callback"];

/**
 * Première ligne de défense : redirige les visiteurs non authentifiés vers
 * /connexion, et bloque l'accès aux routes réservées à un rôle (voir
 * shared/constants/route-permissions.ts). La Row Level Security Postgres
 * reste la dernière ligne de défense (voir supabase/migrations/), et les
 * guards serveur (shared/lib/auth/guards.ts) une protection supplémentaire
 * au niveau des Server Actions.
 *
 * Si Supabase n'est pas configuré (variables d'environnement absentes), le
 * middleware laisse passer toutes les requêtes : l'application tourne alors
 * en mode démo (voir shared/constants/mock-profile.ts).
 */
export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  try {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }
            response = NextResponse.next({ request });
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      },
    );

    // Rafraîchit la session (access token) si nécessaire avant toute autre logique.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (!user && !isPublicPath) {
      const redirectUrl = new URL("/connexion", request.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && pathname === "/connexion") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const requiredRoles = getRequiredRoles(pathname);
    if (user && requiredRoles) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      if (!profile || !requiredRoles.includes(profile.role as Role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return response;
  } catch {
    // Supabase injoignable ou mal configuré : ne jamais bloquer l'application
    // sur une erreur d'infrastructure — seule la RLS reste alors garante des
    // données (le shell peut rester consultable, sans données réelles).
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
