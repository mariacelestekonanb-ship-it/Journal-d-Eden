import { createClient } from "@/shared/lib/supabase/client";

import type { TestimonyFormValues } from "../validation/testimony.schema";

/**
 * Requêtes Supabase brutes du module Témoignages. Ce fichier est le seul à
 * connaître le schéma de la table `testimonies` — jamais appelé depuis un
 * composant (voir `services/testimony-repository.ts`).
 */

export interface RawTestimonyAuthor {
  id: string;
  firstname: string;
  lastname: string;
  is_active: boolean;
}

export interface RawTestimonyRow {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: RawTestimonyAuthor | null;
}

const TESTIMONY_SELECT = `
  id, title, content, created_at, updated_at,
  author:profiles!testimonies_author_id_fkey(id, firstname, lastname, is_active)
`;

export async function queryAllTestimonies(): Promise<RawTestimonyRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonies")
    .select(TESTIMONY_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawTestimonyRow[];
}

export async function createTestimonyQuery(values: TestimonyFormValues, authorId: string): Promise<RawTestimonyRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonies")
    .insert({ title: values.title, content: values.content, author_id: authorId })
    .select(TESTIMONY_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawTestimonyRow;
}

export async function deleteTestimonyQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("testimonies").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
