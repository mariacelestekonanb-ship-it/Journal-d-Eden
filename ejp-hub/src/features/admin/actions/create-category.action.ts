import { AdminService } from "../services/admin.service";
import type { AdminCategory } from "../types/admin.types";
import type { AdminCategoryFormValues } from "../validation/admin-category.schema";

export async function createCategoryAction(values: AdminCategoryFormValues): Promise<AdminCategory> {
  return AdminService.createCategory(values);
}
