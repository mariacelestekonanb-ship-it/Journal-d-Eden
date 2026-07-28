import { createClient } from "@/lib/supabase/client";

import type { TestimonyWithAuthor } from "../types/testimony.types";
import type { TestimonyFormValues } from "../validation/testimony.schema";

const TESTIMONY_SELECT = "*, author:profiles(id, full_name, avatar_url)";

export async function listTestimonies(): Promise<TestimonyWithAuthor[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonies")
    .select(TESTIMONY_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as TestimonyWithAuthor[];
}

export async function createTestimony(values: TestimonyFormValues, authorId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("testimonies").insert({
    title: values.title,
    content: values.content,
    author_id: authorId,
  });

  if (error) throw new Error(error.message);
}

export async function deleteTestimony(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("testimonies").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
