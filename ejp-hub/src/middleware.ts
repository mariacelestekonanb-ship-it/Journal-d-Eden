import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ONLY_PREFIXES = ["/administration"];

/**
 * Rafraîchit la session Supabase sur chaque requête et protège les routes
 * réservées aux administrateurs lorsqu'un utilisateur est bien connecté.
 *
 * Sprint 2 (TODO) : une fois l'authentification branchée sur de vraies
 * données, réactiver la redirection stricte vers /connexion pour tout
 * visiteur non authentifié sur les routes du groupe (app). Pour cette
 * base de fondations, le shell reste consultable sans session Supabase
 * configurée (voir shared/constants/placeholder-profile.ts).
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (user && pathname === "/connexion") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const isAdminOnlyPath = ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (user && isAdminOnlyPath) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
