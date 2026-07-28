import { getCurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { AppShell } from "@/shared/components/layout/app-shell";
import { PLACEHOLDER_PROFILE } from "@/shared/constants/placeholder-profile";

/**
 * Sprint 2 : remplacer le repli sur PLACEHOLDER_PROFILE par une redirection
 * stricte vers /connexion lorsque l'authentification sera branchée sur de
 * vraies données. Pour l'instant, le shell doit rester consultable même
 * sans session Supabase configurée.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = (await getCurrentProfile()) ?? PLACEHOLDER_PROFILE;

  return <AppShell profile={profile}>{children}</AppShell>;
}
