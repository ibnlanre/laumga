import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";

export const MANDATES_COLLECTION = "mandates";

export const mandateTierSchema = z.enum([
  "supporter",
  "builder",
  "guardian",
  "custom",
]);

export const mandateFrequencySchema = z.enum([
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "bi-annually",
  "yearly",
]);

export const mandateStatusSchema = z.enum(["active", "cancelled", "paused"]);

const mandateAmountSchema = z
  .number()
  .positive("Amount must be greater than 0")
  .min(1000, "Amount must be at least 1000");

export const createMandateSchema = z.object({
  amount: mandateAmountSchema,
  frequency: mandateFrequencySchema.default("monthly"),
  paymentPlanId: z.union([z.string(), z.number()]),
  subscriptionId: z.number().nullable().default(null),
  customerEmail: z.email(),
});

const mandateFormSchema = createMandateSchema.extend({
  userId: z.string(),
  tier: mandateTierSchema,
  status: mandateStatusSchema.default("active"),
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

export const updateMandateSchema = mandateSchema.partial().extend({
  status: mandateStatusSchema.optional(),
});
