import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

const executiveTier = z.object({
  "0": z.literal("presidential"),
  "1": z.literal("council"),
  "2": z.literal("directorate"),
});

export const executiveDataSchema = z.object({
  userId: z.string().min(1, "User is required"),
  tenureId: z.string().min(1, "Tenure is required"),
  displayName: z.string().min(1, "Display name is required"),
  photoUrl: z.url("Invalid photo URL"),
  role: z.string().min(1, "Role is required"),
  tier: executiveTier.keyof(),
  portfolio: z.string().optional(),
  quote: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  created: dateSchema,
  updated: dateSchema,
});

export const createExecutiveSchema = executiveDataSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updateExecutiveSchema = createExecutiveSchema.partial();

export const executiveSchema = executiveDataSchema.extend({
  id: z.string(),
});

export const EXECUTIVES_COLLECTION = "executives";
