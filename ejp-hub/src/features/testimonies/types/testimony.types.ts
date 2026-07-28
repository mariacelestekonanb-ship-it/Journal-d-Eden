import type { Database } from "@/types/database";

export type Testimony = Database["public"]["Tables"]["testimonies"]["Row"];

export interface TestimonyWithAuthor extends Testimony {
  author: { id: string; full_name: string; avatar_url: string | null };
}
