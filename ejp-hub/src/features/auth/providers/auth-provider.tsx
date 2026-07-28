"use client";

import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import * as React from "react";

import { createClient } from "@/shared/lib/supabase/client";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export interface AuthContextValue {
  /** Utilisateur Supabase Auth brut (identité de session), ou `null` si déconnecté. */
  user: User | null;
  session: Session | null;
  /** `true` tant que la session initiale n'a pas été résolue. */
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

/**
 * Gère la session Supabase côté client : état initial, écoute des
 * changements (connexion, déconnexion, rafraîchissement automatique du
 * token) et resynchronisation des Server Components via `router.refresh()`.
 *
 * Ceci est une commodité pour les composants client qui ont besoin de l'état
 * d'authentification sans prop-drilling — ce n'est jamais la frontière de
 * sécurité. Cette frontière reste le middleware (accès aux routes) et la Row
 * Level Security Postgres (accès aux données).
 *
 * Si Supabase n'est pas configuré, le provider reste inerte (pas de session,
 * pas d'appel réseau) pour laisser le mode démo fonctionner.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(isSupabaseConfigured());

  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = React.useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/connexion");
    router.refresh();
  }, [router]);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, session, isLoading, signOut }),
    [session, isLoading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  }
  return context;
}
