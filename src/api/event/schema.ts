import { z } from "zod";
import { dateSchema, fieldValueSchema, timestampCodec } from "@/schema/date";

const eventBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  excerpt: z.string().optional(),
  startDate: timestampCodec,
  endDate: timestampCodec.optional(),
  time: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["convention", "seminar", "iftar", "sports", "dawah", "other"]),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled"]).default("draft"),
  imageUrl: z.url("Invalid image URL"),
  registrationLink: z.url("Invalid registration link").optional(),
  maxAttendees: z.number().int().positive().optional(),
  currentAttendees: z.number().int().nonnegative().default(0),
  organizer: z.string().min(1, "Organizer is required"),
  isPublic: z.boolean().default(true),
  created: dateSchema,
  updated: dateSchema,
});

export const eventDataSchema = eventBaseSchema;

export const createEventSchema = eventBaseSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updateEventSchema = createEventSchema.partial();

export const eventSchema = eventDataSchema.extend({
  id: z.string(),
});

export const EVENTS_COLLECTION = "events";
