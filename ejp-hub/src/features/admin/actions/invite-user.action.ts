"use server";

import { requireAdminProfile } from "@/lib/auth/get-current-profile";
import { createAdminClient } from "@/lib/supabase/admin";

import type { InviteUserFormValues } from "../validation/invite-user.schema";

export async function inviteUserAction(
  values: InviteUserFormValues,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await requireAdminProfile();

    const supabase = createAdminClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const { error } = await supabase.auth.admin.inviteUserByEmail(values.email, {
      data: { full_name: values.full_name, role: values.role },
      redirectTo: `${appUrl}/auth/callback?next=/mon-profil`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Action non autorisée." };
  }
}
