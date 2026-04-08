import { z } from "zod";

export const SubmitInquiryInputSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  phone: z.string().trim().max(50).optional(),
  productName: z.string().trim().max(200).optional(),
  quantity: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
});

export type SubmitInquiryInput = z.infer<typeof SubmitInquiryInputSchema>;
