import { TestimonyService } from "../services/testimony.service";
import type { Testimony } from "../types/testimony.types";
import type { TestimonyFormValues } from "../validation/testimony.schema";

export async function createTestimonyAction(
  values: TestimonyFormValues,
  authorId: string,
  authorName: string,
): Promise<Testimony> {
  return TestimonyService.create(values, authorId, authorName);
}
