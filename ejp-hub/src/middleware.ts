import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getRequiredRoles } from "@/shared/constants/route-permissions";
import type { Role } from "@/shared/constants/roles";

const PUBLIC_PATHS = [
  "/connexion",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
  "/rejoindre",
  "/auth/callback",
];

/**
 * Page affichée à un utilisateur authentifié dont le compte n'est pas (ou
 * plus) `ACTIVE` — demande d'adhésion encore `PENDING`, `REFUSED`, ou compte
 * `SUSPENDED`. Volontairement absente de `PUBLIC_PATHS` : il faut être
 * connecté pour la voir, seule l'exigence de statut `ACTIVE` y est levée
 * (sans quoi la redirection ci-dessous boucle indéfiniment).
 */
const ACCOUNT_STATUS_PATH = "/compte-en-attente";

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

    // Le workflow d'adhésion (module Membres) ne bloquerait rien si on
    // s'arrêtait à Supabase Auth : une demande PENDING a déjà un compte et un
    // mot de passe valides. C'est ce bloc qui l'empêche réellement d'entrer
    // tant qu'un admin n'a pas validé — sans lui, /compte-en-attente ne
    // servirait à rien.
    if (user && !isPublicPath) {
      const { data: profile } = await supabase.from("profiles").select("role, status").eq("id", user.id).single();

      if (!profile) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      const isActive = profile.status === "ACTIVE";

      if (pathname === ACCOUNT_STATUS_PATH) {
        return isActive ? NextResponse.redirect(new URL("/", request.url)) : response;
      }

      if (!isActive) {
        return NextResponse.redirect(new URL(ACCOUNT_STATUS_PATH, request.url));
      }

      const requiredRoles = getRequiredRoles(pathname);
      if (requiredRoles && !requiredRoles.includes(profile.role as Role)) {
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
  // `api/` exclu : ces routes (ex. le webhook `/api/push/send` appelé par Supabase, sans
  // cookie de session) gèrent leur propre autorisation — la redirection vers /connexion
  // sur un appelant serveur-à-serveur cassait l'appel (le client suivait la redirection
  // avec la même méthode HTTP, POST, vers une page qui ne l'accepte pas → 405).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
