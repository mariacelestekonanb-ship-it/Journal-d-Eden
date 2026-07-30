import { createClient } from "@/shared/lib/supabase/client";

import type { ProgramFormValues } from "../validation/program.schema";

/**
 * Requêtes Supabase brutes des programmes. Ce fichier est le seul à
 * connaître le schéma de `programs`/`program_members` — jamais appelé
 * depuis un composant (voir `services/program-repository.ts`).
 *
 * L'appartenance à un programme est remplacée intégralement à chaque
 * sauvegarde (`syncProgramMembers` : suppression puis réinsertion) plutôt
 * qu'ajoutée/retirée ligne à ligne — le formulaire soumet toujours la liste
 * complète des membres souhaités, plus simple à raisonner pour une petite
 * équipe qu'un diff incrémental.
 */

export interface RawProgramMember {
  id: string;
  firstname: string;
  lastname: string;
}

export interface RawProgramRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  members: { member: RawProgramMember }[];
}

const PROGRAM_SELECT = `
  id, name, description, created_at, updated_at,
  members:program_members(member:profiles(id, firstname, lastname))
`;

async function syncProgramMembers(programId: string, memberIds: string[]): Promise<void> {
  const supabase = createClient();

  const { error: deleteError } = await supabase.from("program_members").delete().eq("program_id", programId);
  if (deleteError) throw new Error(deleteError.message);

  if (memberIds.length === 0) return;

  const { error: insertError } = await supabase
    .from("program_members")
    .insert(memberIds.map((memberId) => ({ program_id: programId, member_id: memberId })));
  if (insertError) throw new Error(insertError.message);
}

async function getProgramById(id: string): Promise<RawProgramRow> {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs").select(PROGRAM_SELECT).eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as unknown as RawProgramRow;
}

export async function queryAllPrograms(): Promise<RawProgramRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs").select(PROGRAM_SELECT).order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data as unknown as RawProgramRow[];
}

export async function createProgramQuery(values: ProgramFormValues): Promise<RawProgramRow> {
  const supabase = createClient();
  const { data: created, error } = await supabase
    .from("programs")
    .insert({ name: values.name, description: values.description || null })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await syncProgramMembers(created.id, values.memberIds);
  return getProgramById(created.id);
}

export async function updateProgramQuery(id: string, values: ProgramFormValues): Promise<RawProgramRow> {
  const supabase = createClient();
  const { error } = await supabase
    .from("programs")
    .update({ name: values.name, description: values.description || null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await syncProgramMembers(id, values.memberIds);
  return getProgramById(id);
}

export async function deleteProgramQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
