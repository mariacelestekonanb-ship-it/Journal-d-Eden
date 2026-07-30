import { z } from "zod";

export const assignmentResponseSchema = z.object({
  response: z.enum(["ACCEPTED", "DECLINED"]),
  comment: z.string().max(1000).optional().or(z.literal("")),
});

export type AssignmentResponseFormValues = z.infer<typeof assignmentResponseSchema>;
