import { ReplacementRequestService } from "../services/replacement-request.service";

export async function cancelReplacementRequestAction(id: string): Promise<void> {
  return ReplacementRequestService.cancel(id);
}
