import { redirectIfUnauthenticated } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";
import { AppShell } from "@/shared/components/layout/app-shell";
import { MOCK_PROFILE } from "@/shared/constants/mock-profile";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <AppShell profile={MOCK_PROFILE}>{children}</AppShell>;
  }

  const profile = await redirectIfUnauthenticated();

  return <AppShell profile={profile}>{children}</AppShell>;
}
