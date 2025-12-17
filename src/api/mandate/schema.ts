import { z } from "zod";

import { dateSchema, fieldValueSchema, isoDateTimeString } from "@/schema/date";

export const MANDATES_COLLECTION = "mandates";

export const mandateTierSchema = z.enum([
  "supporter",
  "builder",
  "guardian",
  "custom",
]);

export const mandateStatusSchema = z.enum([
  "initiated",
  "active",
  "paused",
  "cancelled",
  "completed",
  "rejected",
]);

export const mandateFrequencySchema = z.enum([
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

const mandateAmountSchema = z
  .number()
  .positive("Amount must be greater than 0")
  .min(1000, "Amount must be at least 1000");

export const createMandateSchema = z.object({
  amount: mandateAmountSchema,
  frequency: mandateFrequencySchema.default("monthly"),
  startDate: isoDateTimeString.min(1, "Start date is required"),
  endDate: isoDateTimeString.nullable().default(null),
  bankCode: z.string().min(3, "Bank is required"),
  accountNumber: z.string().length(10, "Account number must be 10 digits"),
});

const mandateFormSchema = createMandateSchema
  .omit({
    bankCode: true,
    accountNumber: true,
  })
  .extend({
    userId: z.string(),
    tier: mandateTierSchema,
    status: mandateStatusSchema,
    flutterwaveReference: z.string().nullable().default(null),
    flutterwaveAccountId: z.union([z.number(), z.string()]),
    flutterwaveCustomerId: z.union([z.number(), z.string()]),
    flutterwaveStatus: z.string().nullable().default(null),
  });

export const mandateDataSchema = mandateFormSchema.extend({
  created: dateSchema,
  updated: dateSchema,
});

export const createMandateDataSchema = mandateFormSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const mandateSchema = mandateDataSchema.extend({
  id: z.string(),
});
