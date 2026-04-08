import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id } from "./helper";

export const InquiriesTable = sqliteTable(
  "inquiries",
  {
    id,
    companyName: text("company_name").notNull(),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    productName: text("product_name"),
    quantity: text("quantity"),
    message: text("message"),
    createdAt,
  },
  (table) => [
    index("inquiries_email_created_idx").on(table.email, table.createdAt),
    index("inquiries_product_created_idx").on(
      table.productName,
      table.createdAt,
    ),
  ],
);

export type Inquiry = typeof InquiriesTable.$inferSelect;
export type InquiryInsert = typeof InquiriesTable.$inferInsert;
