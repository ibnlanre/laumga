import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

export const mediaDataSchema = z.object({
  libraryId: z.string().optional(),
  url: z.url("Invalid media URL"),
  caption: z.string().optional(),
  uploaded: dateSchema,
  fileName: z.string().min(1, "File name is required"),
  size: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export const createMediaSchema = mediaDataSchema.extend({
  uploaded: fieldValueSchema,
});

export const updateMediaSchema = createMediaSchema.partial();

export const mediaSchema = mediaDataSchema.extend({
  id: z.string(),
});

export const MEDIA_COLLECTION = "media";
