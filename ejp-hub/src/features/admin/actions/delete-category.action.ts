import { AdminService } from "../services/admin.service";

export async function deleteCategoryAction(id: string): Promise<void> {
  return AdminService.removeCategory(id);
}
