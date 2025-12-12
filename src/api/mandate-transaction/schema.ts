import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

const transactionFormSchema = z.object({
  mandateId: z.string(),
  userId: z.string(),
  amount: z.number(),
  monoReference: z.string(),
  monoDebitId: z.string(),
  status: z.enum(["successful", "failed", "processing"]),
  failureReason: z.string().nullable(),
  paidAt: z.string(),
});

export const mandateTransactionDataSchema = transactionFormSchema.extend({
  created: dateSchema,
});

export const createMandateTransactionSchema = transactionFormSchema.extend({
  created: fieldValueSchema,
});

export const mandateTransactionSchema = mandateTransactionDataSchema.extend({
  id: z.string(),
});

export const MANDATE_TRANSACTIONS_COLLECTION = "mandateTransactions";