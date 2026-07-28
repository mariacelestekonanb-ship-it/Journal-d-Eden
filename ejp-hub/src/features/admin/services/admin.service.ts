import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

import type { AdminProfile } from "../types/user.types";

export async function listProfiles(): Promise<AdminProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserRole(id: string, role: UserRole): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleUserActive(id: string, isActive: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
}
