import { createServerFn } from "@tanstack/react-start";
import {
  createRateLimitMiddleware,
  dbMiddleware,
  errorLoggingMiddleware,
} from "@/lib/middlewares";
import { SubmitInquiryInputSchema } from "../inquiries.schema";
import * as InquiryService from "../service/inquiries.service";

export const submitInquiryFn = createServerFn({
  method: "POST",
})
  .middleware([
    createRateLimitMiddleware({
      capacity: 5,
      interval: "1h",
      key: "inquiry:submit",
    }),
    dbMiddleware,
    errorLoggingMiddleware,
  ])
  .inputValidator(SubmitInquiryInputSchema)
  .handler(
    async ({ data, context }) =>
      await InquiryService.submitInquiry(context, data),
  );
