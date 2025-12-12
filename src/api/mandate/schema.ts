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
  "rejected",
]);

export const mandateFrequencySchema = z.enum([
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

export const mandateTypeSchema = z.enum(["emandate", "signed", "gsm"]);

export const mandateDebitTypeSchema = z.enum(["variable", "fixed"]);

const mandateAmountSchema = z
  .number()
  .min(20_000, "Mandates must be at least ₦200 in value (20,000 kobo)")
  .max(100_000_000, "Mandates cannot exceed ₦1,000,000 (in kobo)");

export const createMandateSchema = z.object({
  amount: mandateAmountSchema,
  frequency: mandateFrequencySchema.default("monthly"),
  startDate: z.date().default(new Date()),
  endDate: z.date().nullable().default(null),
});

const mandateFormSchema = z.object({
  userId: z.string(),
  amount: z.number(),
  frequency: mandateFrequencySchema,
  tier: mandateTierSchema,
  status: mandateStatusSchema,
  monoMandateId: z.string(),
  monoCustomerId: z.string(),
  monoReference: z.string(),
  monoUrl: z.string().nullable().default(null),
  mandateType: mandateTypeSchema,
  debitType: mandateDebitTypeSchema,
  startDate: z.date().default(new Date()),
  endDate: z.date().nullable().default(null),
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
