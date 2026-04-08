import type { SubmitInquiryInput } from "@/features/inquiries/inquiries.schema";
import * as InquiryRepo from "../data/inquiries.data";

export async function submitInquiry(
  context: DbContext,
  input: SubmitInquiryInput,
) {
  const created = await InquiryRepo.createInquiry(context.db, {
    companyName: input.companyName,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone,
    productName: input.productName,
    quantity: input.quantity,
    message: input.message,
  });

  return {
    success: true,
    id: created?.id ?? null,
  };
}
