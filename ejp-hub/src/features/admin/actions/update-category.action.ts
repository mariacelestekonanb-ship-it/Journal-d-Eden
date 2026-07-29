import { AdminService } from "../services/admin.service";
import type { AdminCategory } from "../types/admin.types";
import type { AdminCategoryFormValues } from "../validation/admin-category.schema";

export async function updateCategoryAction(id: string, values: AdminCategoryFormValues): Promise<AdminCategory> {
  return AdminService.updateCategory(id, values);
}
