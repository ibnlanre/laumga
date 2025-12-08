import { dateSchema, fieldValueSchema } from "@/schema/date";
import { z } from "zod";

export const chapterDataSchema = z.object({
  name: z.string().min(1, "Chapter name is required"),
  state: z.string().min(1, "State is required"),
  region: z.enum([
    "North Central",
    "North East",
    "North West",
    "South East",
    "South South",
    "South West",
  ]),
  presidentId: z.string().min(1, "President is required"),
  meetingVenue: z.string().optional(),
  meetingSchedule: z.string().optional(),
  contactEmail: z.email("Invalid email address").optional(),
  contactPhone: z.string().optional(),
  memberCount: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  created: dateSchema,
  updated: dateSchema,
});

export const createChapterSchema = chapterDataSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updateChapterSchema = createChapterSchema.partial();

export const chapterSchema = chapterDataSchema.extend({
  id: z.string(),
});

export const CHAPTERS_COLLECTION = "chapters";
