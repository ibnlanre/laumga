import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

export const MEDIA_CATEGORIES = [
  "humanitarian",
  "conventions",
  "campus-life",
] as const;

export const mediaFormSchema = z.object({
  libraryId: z.string().optional(),
  url: z.url("Invalid media URL"),
  caption: z.string().optional(),
  category: z.enum(MEDIA_CATEGORIES).nullable().default(null),
  fileName: z.string().min(1, "File name is required"),
  size: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export const mediaDataSchema = mediaFormSchema.extend({
  uploaded: dateSchema,
});

export const createMediaSchema = mediaFormSchema.extend({
  uploaded: fieldValueSchema,
});

export const updateMediaSchema = createMediaSchema.partial();

export const mediaSchema = mediaDataSchema.extend({
  id: z.string(),
});

export const MEDIA_COLLECTION = "media";
