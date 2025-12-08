import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";

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
]);

export const mandateFrequencySchema = z.enum([
  "monthly",
  "quarterly",
  "annually",
  "one-time",
]);

export const mandateDurationSchema = z.enum([
  "12-months",
  "24-months",
  "indefinite",
]);

const mandateBaseSchema = z.object({
  userId: z.string(),
  amount: z.number(),
  frequency: mandateFrequencySchema,
  duration: mandateDurationSchema,
  tier: mandateTierSchema,
  status: mandateStatusSchema,
  monoMandateId: z.string().nullable(),
  monoCustomerId: z.string().nullable(),
  monoReference: z.string(),
  monoUrl: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  nextChargeDate: z.string().nullable(),
});

export const mandateRecordSchema = mandateBaseSchema.extend({
  created: dateSchema,
  updated: dateSchema,
});

export const createMandateRecordSchema = mandateBaseSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const mandateSchema = mandateRecordSchema.extend({
  id: z.string(),
});

export const createMandateSchema = z.object({
  amount: z
    .number()
    .min(5_000, "Amount must be at least ₦5,000")
    .max(1_000_000, "Amount cannot exceed ₦1,000,000"),
  frequency: mandateFrequencySchema,
  duration: mandateDurationSchema,
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits"),
  bankCode: z.string().min(1, "Bank is required"),
  bvn: z.string().length(11, "BVN must be 11 digits"),
});
