import { z } from "zod";
import { fieldValueCodec, timestampCodec } from "@/schema/date";

export const feedDataSchema = z.object({
  location: z.string(),
  timestamp: timestampCodec,
  amount: z.number().nullable(),
  gender: z.enum(["male", "female"]),
  userId: z.string().nullable(),
  type: z.enum(["donation", "registration"]),
});

export const feedSchema = feedDataSchema.extend({
  id: z.string(),
});

export const createFeedSchema = feedDataSchema.extend({
  timestamp: fieldValueCodec,
});

export const updateFeedSchema = createFeedSchema.partial();

export const FEED_COLLECTION = "feed";
