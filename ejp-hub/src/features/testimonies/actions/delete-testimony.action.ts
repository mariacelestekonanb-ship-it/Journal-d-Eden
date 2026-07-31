import { TestimonyService } from "../services/testimony.service";

export async function deleteTestimonyAction(id: string): Promise<void> {
  return TestimonyService.remove(id);
}
