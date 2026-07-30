import { z } from "zod";

export const replacementRequestSchema = z.object({
  proposedMemberId: z.string().min(1, "Choisissez un remplaçant."),
  comment: z.string().max(1000).optional().or(z.literal("")),
});

export type ReplacementRequestFormValues = z.infer<typeof replacementRequestSchema>;
