import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";

export const EXECUTIVE_TENURES_COLLECTION = "executiveTenures";

export const executiveTenureDataSchema = z.object({
  label: z.string().min(1, "Label is required"),
  year: z.string().min(4, "Year is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().default(null),
  theme: z.string().nullable().default(null),
  isActive: z.boolean().default(false),
  created: dateSchema,
  updated: dateSchema,
});

export const createExecutiveTenureSchema = executiveTenureDataSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updateExecutiveTenureSchema =
  createExecutiveTenureSchema.partial();

export const executiveTenureSchema = executiveTenureDataSchema.extend({
  id: z.string(),
});
