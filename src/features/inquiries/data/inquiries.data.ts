import { desc } from "drizzle-orm";
import { InquiriesTable, type InquiryInsert } from "@/lib/db/schema";

export async function createInquiry(db: Db, input: InquiryInsert) {
  const [row] = await db.insert(InquiriesTable).values(input).returning({
    id: InquiriesTable.id,
  });

  return row;
}

export async function listLatestInquiries(db: Db, limit = 50) {
  return db
    .select()
    .from(InquiriesTable)
    .orderBy(desc(InquiriesTable.createdAt), desc(InquiriesTable.id))
    .limit(limit);
}
